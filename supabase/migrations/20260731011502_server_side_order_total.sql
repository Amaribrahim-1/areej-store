-- Areej — Server-side order total (Phase 1.5)
-- The only path for money to enter the database: a SECURITY DEFINER RPC that
-- re-reads current prices at call time, computes the order total server-side,
-- and inserts the order + its line items atomically. Client-submitted prices
-- or totals are never trusted (coding-standards.md §7). Explicitly out of
-- scope here: TypeScript types (1.6), seed data (1.7), Supabase advisors
-- (1.8), and every piece of application code that will call this function —
-- the checkoutSchema/server action (Phase 6) and cart wiring (Phase 4).

-- =========================================================================
-- place_order()
-- =========================================================================
-- SECURITY DEFINER so it can insert into orders/order_items, which
-- deliberately have no insert policy (see 20260731011500_add_rls_policies.sql)
-- — this function is meant to be their only writer.
--
-- `set search_path = ''` + fully-qualified table names (public.products,
-- public.product_variants, etc.) on every reference, same pattern as
-- private.is_admin(). Without this, a SECURITY DEFINER function resolves
-- unqualified names using the *caller's* search_path at call time — a
-- malicious or compromised role could create a same-named object earlier in
-- that path (e.g. a fake "products" table/view) and have this function
-- silently operate on it instead, while still running with this function's
-- elevated owner privileges. Fully qualifying every reference removes that
-- lookup entirely.
create or replace function public.place_order(
  items jsonb,
  customer_name text,
  customer_phone text,
  governorate text,
  markaz text,
  address_text text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid;
  v_order_id uuid;
  v_total numeric(10, 2);
  v_lines jsonb;
  v_resolved_count integer;
  v_requested_count integer;
  v_item jsonb;
  v_quantity integer;
begin
  -- user_id is read from the JWT server-side, never accepted as a parameter.
  -- Accepting it as a parameter would let any authenticated customer place an
  -- order under someone else's account by simply passing a different uuid —
  -- the same class of bug the column-level grant on profiles.role prevents
  -- for role escalation (20260731011500_add_rls_policies.sql).
  v_user_id := (select auth.uid());
  if v_user_id is null then
    raise exception 'place_order requires an authenticated user';
  end if;

  if items is null or jsonb_typeof(items) <> 'array' or jsonb_array_length(items) = 0 then
    raise exception 'items must be a non-empty array';
  end if;

  -- Validate variant_id and quantity up front, one raw entry at a time,
  -- before any resolving/merging happens. order_items already has
  -- CHECK (quantity > 0), but failing here gives a specific, readable
  -- message instead of letting a bad line surface as a raw
  -- constraint-violation error from deep inside the insert at the bottom of
  -- this function.
  for v_item in select * from jsonb_array_elements(items)
  loop
    -- Without this check, an item with a missing/null variant_id would
    -- silently pass the later resolved-count-vs-requested-count comparison:
    -- count(distinct x) in Postgres ignores NULLs on both sides of that
    -- comparison, so a null variant_id doesn't shrink v_requested_count the
    -- way a wrong-but-non-null variant_id shrinks v_resolved_count. The
    -- practical outcome without this fix isn't a security hole — orders.total
    -- being NULL would still block the insert via its NOT NULL constraint —
    -- but it would surface as a raw constraint-violation error instead of a
    -- readable one, the same gap this loop already closes for bad quantities.
    if v_item ->> 'variant_id' is null then
      raise exception 'variant_id is required for every item';
    end if;

    v_quantity := (v_item ->> 'quantity')::integer;
    if v_quantity is null or v_quantity <= 0 then
      raise exception 'quantity must be greater than 0 (variant_id: %)', v_item ->> 'variant_id';
    end if;
  end loop;

  -- Resolve every line in a single read of current_price. This is the actual
  -- point of the whole function: whatever price the client believes it is
  -- paying is ignored entirely, and current_price is re-read fresh here.
  --
  -- Duplicate variant_id entries in `items` are merged by summing quantity
  -- (not rejected) — a client sending the same variant twice is far more
  -- likely to be a cart-state bug (e.g. a double "add to cart" click racing)
  -- than an attack, and merging still prices every unit at this fresh
  -- server-side read, so there's no security cost to allowing it.
  --
  -- products.status = 'active' is filtered explicitly in this query's own
  -- WHERE clause rather than left to RLS: SECURITY DEFINER bypasses RLS for
  -- every read inside this function, not just the inserts below, so RLS
  -- provides zero protection here even though it protects the same tables
  -- for normal client queries.
  --
  -- The resolved rows are captured once into v_lines (jsonb) and reused
  -- below for both the total and the order_items insert, instead of being
  -- queried a second time — re-reading current_price a second time later in
  -- this same function could disagree with this first read if a price
  -- changed concurrently mid-transaction, which would desync total from the
  -- line items it's supposed to equal.
  select
    jsonb_agg(jsonb_build_object(
      'product_id', p.id,
      'variant_id', pv.id,
      'product_name', p.name,
      'variant_label', pv.volume_label,
      'unit_price', pv.current_price,
      'quantity', merged.quantity,
      'line_total', pv.current_price * merged.quantity
    )),
    sum(pv.current_price * merged.quantity),
    count(*)
  into v_lines, v_total, v_resolved_count
  from (
    select
      (elem ->> 'variant_id')::uuid as variant_id,
      sum((elem ->> 'quantity')::integer) as quantity
    from jsonb_array_elements(items) as elem
    group by (elem ->> 'variant_id')::uuid
  ) merged
  join public.product_variants pv on pv.id = merged.variant_id
  join public.products p on p.id = pv.product_id
  where p.status = 'active';

  select count(distinct (elem ->> 'variant_id')::uuid)
  into v_requested_count
  from jsonb_array_elements(items) as elem;

  -- A shortfall here means at least one variant_id didn't resolve — either it
  -- doesn't exist at all, or it belongs to a product that isn't active. Raise
  -- and abort rather than silently dropping the line: this is still a single
  -- function call inside one implicit transaction, so the exception rolls
  -- everything back with nothing partially inserted.
  if coalesce(v_resolved_count, 0) < coalesce(v_requested_count, 0) then
    raise exception 'one or more items could not be found or are no longer available';
  end if;

  -- total is an accumulation (sum(...) over the resolved lines above), not a
  -- single hardcoded expression — adding a future shipping_fee/discount term
  -- is a small change to this line later (e.g. `v_total + v_shipping -
  -- v_discount`), not a restructure. No shipping_fee or coupon/discount
  -- column or parameter is introduced now (tasks.md 1.5 keeps both out of
  -- MVP entirely).
  --
  -- status and payment_method are omitted here on purpose — both already
  -- default to 'Pending' and 'cod' respectively (20260731003400_create_core_schema.sql).
  insert into public.orders (
    user_id, total, customer_name, customer_phone, governorate, markaz, address_text
  )
  values (
    v_user_id, v_total, customer_name, customer_phone, governorate, markaz, address_text
  )
  returning id into v_order_id;

  insert into public.order_items (
    order_id, product_id, variant_id, product_name, variant_label, unit_price, quantity, line_total
  )
  select
    v_order_id,
    (line ->> 'product_id')::uuid,
    (line ->> 'variant_id')::uuid,
    line ->> 'product_name',
    line ->> 'variant_label',
    (line ->> 'unit_price')::numeric,
    (line ->> 'quantity')::integer,
    (line ->> 'line_total')::numeric
  from jsonb_array_elements(v_lines) as line;

  return v_order_id;
end;
$$;

-- This function is the last line of defense for *price* specifically — it
-- guarantees the amount charged matches current_price at the moment of
-- purchase, no matter what the client submitted. It is not a general
-- validation layer: full re-validation of customer_name/phone/address against
-- the shared Zod checkoutSchema happens client-side and again in the Next.js
-- server action that calls this RPC (Phase 6, a later task) — this function
-- does not attempt to replicate that field-level validation.

-- `anon` is deliberately not granted execute here, unlike the read policies
-- that need it for guest browsing: spec decision #7 requires a customer to be
-- logged in to complete checkout, so there is no guest code path that ever
-- calls this function.
revoke execute on function public.place_order(jsonb, text, text, text, text, text) from public;
grant execute on function public.place_order(jsonb, text, text, text, text, text) to authenticated;
