-- Admin product create (task 13.7).
-- Product + variants must insert in one transaction: products have no DELETE
-- policy (soft-delete only, 1.3 / 13.10), so a two-step client insert that
-- fails on variants would leave a product with zero variants that neither
-- the catalog nor the admin list can see (both INNER JOIN variants).
-- SECURITY INVOKER: admin INSERT RLS already covers both tables; non-admin
-- is rejected before any write. Not SECURITY DEFINER — public definer RPCs
-- belong in `private` per the security checklist.

create or replace function public.create_admin_product(
  p_name text,
  p_slug text,
  p_description text,
  p_category text,
  p_status text,
  p_image_url text,
  p_variants jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_product_id uuid;
  v_variant jsonb;
  v_index integer := 0;
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  if p_variants is null
    or jsonb_typeof(p_variants) <> 'array'
    or jsonb_array_length(p_variants) = 0 then
    raise exception 'INVALID_PRODUCT_PAYLOAD';
  end if;

  insert into public.products (
    name,
    slug,
    description,
    category,
    status,
    image_url
  )
  values (
    p_name,
    p_slug,
    p_description,
    p_category,
    p_status,
    p_image_url
  )
  returning id into v_product_id;

  for v_variant in select * from jsonb_array_elements(p_variants)
  loop
    insert into public.product_variants (
      product_id,
      volume_label,
      original_price,
      current_price,
      sort_order
    )
    values (
      v_product_id,
      nullif(btrim(coalesce(v_variant ->> 'volume_label', '')), ''),
      (v_variant ->> 'original_price')::numeric,
      (v_variant ->> 'current_price')::numeric,
      v_index
    );
    v_index := v_index + 1;
  end loop;

  return v_product_id;
end;
$$;

comment on function public.create_admin_product(
  text, text, text, text, text, text, jsonb
) is
  'Admin create: insert product + variants atomically. Admin-only. Empty variants rejected so the product row cannot commit without a size.';

revoke all on function public.create_admin_product(
  text, text, text, text, text, text, jsonb
) from public;
revoke all on function public.create_admin_product(
  text, text, text, text, text, text, jsonb
) from anon, authenticated;
grant execute on function public.create_admin_product(
  text, text, text, text, text, text, jsonb
) to authenticated;
