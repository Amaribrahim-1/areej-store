-- Areej — Admin can delete any review, moderation only (task A.1).
-- Customer owner delete already exists (reviews_delete_own, C.2). This adds
-- an admin-only delete path on top of it — no admin UPDATE policy, since the
-- task is explicitly delete-only moderation, not editing someone else's
-- rating/comment.

-- USING: any row, but only when the caller is an admin. private.is_admin()
-- already backs list_admin_reviews (14.1) and other admin RPCs/policies.
-- DELETE has no WITH CHECK (no replacement row).
create policy reviews_delete_admin
on public.reviews
for delete
to authenticated
using (private.is_admin());

comment on policy reviews_delete_admin on public.reviews is
  'Admin moderation delete — any review row. Owner delete is a separate policy (reviews_delete_own).';
