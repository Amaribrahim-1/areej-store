-- Areej — Task 15.5 (Supabase advisors re-run): consolidate reviews DELETE policies.
-- Advisor: multiple_permissive_policies — reviews had two separate permissive
-- DELETE policies for `authenticated` (reviews_delete_own from C.2,
-- reviews_delete_admin from A.1). Postgres must evaluate every permissive
-- policy per row for the same role/action, so two policies cost more than one
-- with an OR condition. Same access rules, one policy.

drop policy if exists reviews_delete_own on public.reviews;
drop policy if exists reviews_delete_admin on public.reviews;

create policy reviews_delete_own_or_admin
on public.reviews
for delete
to authenticated
using (user_id = (select auth.uid()) or private.is_admin());

comment on policy reviews_delete_own_or_admin on public.reviews is
  'Owner delete (C.2) or admin moderation delete (A.1), merged into one permissive policy per advisor 0006_multiple_permissive_policies.';
