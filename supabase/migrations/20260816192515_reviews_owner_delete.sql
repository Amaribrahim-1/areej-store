-- Areej — Customer can delete their own review (task C.2).
-- C.1 added owner UPDATE only. Owner DELETE is now in scope. Admin delete
-- of any review is Phase A (A.1) — not this migration. Guests still cannot
-- write reviews. Unique (product_id, user_id) still applies while a row exists;
-- after a successful delete the customer can insert again.

-- USING: only the author can delete their row.
-- DELETE has no WITH CHECK (no replacement row).
-- (select auth.uid()) keeps the uid lookup as a single initplan, same as
-- the rest of this project's RLS policies.
create policy reviews_delete_own
on public.reviews
for delete
to authenticated
using (user_id = (select auth.uid()));

-- Default table privileges grant DELETE to anon. RLS already blocked it
-- (no anon delete policy). Revoke so a future policy cannot accidentally
-- open guest deletes. Authenticated keeps DELETE so the owner policy can fire.
revoke delete on public.reviews from anon;
grant delete on public.reviews to authenticated;
