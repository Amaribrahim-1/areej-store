-- Areej — RLS policies (Phase 1.3)
-- Enables RLS + default deny on all 7 core tables, then adds explicit
-- per-role policies. Explicitly out of scope here: storage bucket policies
-- (1.4), the place-order RPC (1.5), seed data (1.7), Supabase advisors (1.8).

-- =========================================================================
-- is_admin() helper
-- =========================================================================
-- Almost every policy below needs an "is this user an admin?" check, which
-- normally means reading profiles.role. But profiles has RLS enabled, so a
-- naive `exists (select 1 from profiles where ...)` inside another table's
-- policy re-runs profiles' own RLS on every check — and if profiles itself
-- ever needed an admin-read-all policy written the same way, it would be
-- directly self-referential.
--
-- Fix: a SECURITY DEFINER function. It runs as its owner, and Postgres
-- bypasses RLS for a table's owner by default (we never set FORCE ROW LEVEL
-- SECURITY), so the read of profiles.role inside this function hits no RLS
-- policy at all — no recursion, no repeated policy-on-policy evaluation.
--
-- Kept in a private, unexposed `private` schema rather than `public`: the
-- Supabase security checklist is explicit that SECURITY DEFINER functions
-- must not live in an exposed schema, since anything in `public` is
-- reachable via the client (supabase.rpc()/PostgREST). Only `public` is
-- exposed by default (no supabase/config.toml override in this repo), so
-- `private` is reachable only from inside SQL (policies/triggers) — a
-- future server-side admin guard (task 11.2) will just query profiles.role
-- directly through the normal authenticated client instead.
create schema if not exists private;

create or replace function private.is_admin()
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid()) and role = 'admin'
  );
$$;

-- `anon` needs EXECUTE too, not just `authenticated`: the products /
-- product_variants SELECT policies below run `to anon, authenticated` (guest
-- browsing) and reference is_admin() inside an `or` condition. Postgres
-- checks EXECUTE privilege at plan time for every role a policy applies to —
-- not only whichever branch of the `or` ends up true at runtime — so a
-- missing grant for `anon` would break guest browsing entirely with
-- "permission denied for function is_admin". Safe to grant: the function
-- only returns a boolean, resolves to `false` for `anon` since auth.uid() is
-- null for them, and `private` stays unreachable via the API regardless.
revoke execute on function private.is_admin() from public;
grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;

-- =========================================================================
-- Enable RLS + default deny on every table
-- =========================================================================
-- Enabling RLS with no policies yet means zero access from anon/authenticated
-- until the explicit policies below add it back, table by table.
alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.contact_messages enable row level security;

-- =========================================================================
-- products
-- =========================================================================
-- Guests and customers see only active products; admin (task 13.1) needs to
-- see inactive ones too in the admin products table.
create policy products_select_active_or_admin
on public.products
for select
to anon, authenticated
using (status = 'active' or (select private.is_admin()));

create policy products_insert_admin
on public.products
for insert
to authenticated
with check ((select private.is_admin()));

create policy products_update_admin
on public.products
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- No delete policy at all, on purpose: products are soft-deleted via
-- status = 'inactive' only (task 13.10). Omitting delete here enforces
-- "no hard delete" at the DB level, not just as an app-layer convention.

-- Supports the predicate above and the storefront's "active only" catalog
-- query (task 3.2) — added alongside the policy it directly serves.
create index idx_products_status on public.products (status);

-- =========================================================================
-- product_variants
-- =========================================================================
-- No status column here — visibility follows the parent product's status.
create policy product_variants_select_active_or_admin
on public.product_variants
for select
to anon, authenticated
using (
  (select private.is_admin())
  or exists (
    select 1 from public.products p
    where p.id = product_variants.product_id and p.status = 'active'
  )
);

create policy product_variants_insert_admin
on public.product_variants
for insert
to authenticated
with check ((select private.is_admin()));

create policy product_variants_update_admin
on public.product_variants
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Delete is allowed here (unlike products): the existing
-- product_variants -> order_items FK is ON DELETE RESTRICT, so a variant
-- referenced by past order lines is already protected at the DB level
-- (task 13.8, "deleted only when safe"). No need to also ban delete in RLS.
create policy product_variants_delete_admin
on public.product_variants
for delete
to authenticated
using ((select private.is_admin()));

-- =========================================================================
-- orders
-- =========================================================================
create policy orders_select_own_or_admin
on public.orders
for select
to authenticated
using (user_id = (select auth.uid()) or (select private.is_admin()));

create policy orders_update_admin_status
on public.orders
for update
to authenticated
using ((select private.is_admin()))
with check ((select private.is_admin()));

-- Row-level policy alone would let this update touch any column, including
-- total and the customer/address snapshot taken at checkout. RLS controls
-- which rows; this column grant controls which columns — only `status` is
-- writable, keeping every other field immutable after order creation.
revoke update on public.orders from authenticated;
grant update (status) on public.orders to authenticated;

-- No insert/delete policy: orders are created exclusively by the task 1.5
-- RPC (itself SECURITY DEFINER, so it bypasses RLS to insert after
-- recalculating totals server-side) — never by a direct client insert.

-- =========================================================================
-- order_items
-- =========================================================================
create policy order_items_select_own_or_admin
on public.order_items
for select
to authenticated
using (
  (select private.is_admin())
  or exists (
    select 1 from public.orders o
    where o.id = order_items.order_id and o.user_id = (select auth.uid())
  )
);

-- No insert/update/delete policy: same reasoning as orders — the task 1.5
-- RPC is the only writer.

-- =========================================================================
-- reviews
-- =========================================================================
-- Public read already satisfies "admin read-all" from the agreed shape, so
-- no separate admin policy is needed here.
create policy reviews_select_public
on public.reviews
for select
to anon, authenticated
using (true);

-- A customer can only insert a review row as themselves. The existing
-- unique (product_id, user_id) constraint from 1.2 already blocks a second
-- review for the same product — no RLS needed for that part.
create policy reviews_insert_own
on public.reviews
for insert
to authenticated
with check (user_id = (select auth.uid()));

-- No update/delete policy: moderation (task 14.4) is explicitly undecided.
-- Default deny is the correct "not yet" state, not an oversight.

-- =========================================================================
-- profiles
-- =========================================================================
create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (id = (select auth.uid()) or (select private.is_admin()));

create policy profiles_update_own
on public.profiles
for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

-- Row-level policy alone would let a customer UPDATE their own role to
-- 'admin' — `with check` can only compare against the new row, not the row
-- it's replacing, so it can't block that by itself. This column grant is
-- the actual fix: role is excluded entirely, so there is no client path to
-- change it. No update policy exists for admin either, so role changes stay
-- a Studio/service-role-only operation (matches "no self-service admin
-- signup", task 11.1).
revoke update on public.profiles from authenticated;
grant update (full_name, phone, governorate, markaz, address_text)
on public.profiles to authenticated;

-- No insert policy: rows are created by the Phase 5 signup trigger (expected
-- to run SECURITY DEFINER, bypassing RLS), not by direct client insert.

-- =========================================================================
-- contact_messages
-- =========================================================================
create policy contact_messages_insert_anyone
on public.contact_messages
for insert
to anon, authenticated
with check (true);

create policy contact_messages_select_admin
on public.contact_messages
for select
to authenticated
using ((select private.is_admin()));
