-- Areej — Customer can update their own review (task C.1).
-- Phase 1.3 left reviews with SELECT + INSERT only; default-deny UPDATE was
-- the correct "not yet" state. Owner UPDATE is now in scope. Admin still
-- cannot edit customer reviews (task 14.4 / Phase A is delete-only).
-- Customer DELETE is task C.2 — not this migration.

-- USING: only the author can target their row.
-- WITH CHECK: they cannot reassign user_id on the way out.
-- (select auth.uid()) keeps the uid lookup as a single initplan, same as
-- the rest of this project's RLS policies.
create policy reviews_update_own
on public.reviews
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

-- Row-level policy alone would let an owner UPDATE product_id / user_id /
-- created_at. RLS controls which rows; this column grant controls which
-- columns — only rating and comment are writable. Same pattern as
-- profiles.role and orders.status.
revoke update on public.reviews from anon, authenticated;
grant update (rating, comment) on public.reviews to authenticated;
