-- Areej — Storage bucket for product images (Phase 1.4)
-- Creates the `product-images` bucket and its access policies. Explicitly
-- out of scope here (task 13.6): the upload UI, client-side WebP
-- compression, and the file-path/overwrite naming convention.

-- =========================================================================
-- Bucket
-- =========================================================================
-- 1MB file_size_limit: task 13.6 compresses every upload to WebP
-- client-side before it reaches storage, so this cap is a safety net
-- against a compression bug bypassing the intended size, not the primary
-- control. At 1MB/image this still allows ~1000 images before approaching
-- the 1GB free-tier ceiling — comfortable headroom for this store's actual
-- catalog size.
--
-- allowed_mime_types accepts jpeg/png/webp, not webp-only: task 1.4 in
-- tasks.md calls for "common image MIME types," and task 1.7 (seed data)
-- uploads manually through Supabase Studio with no client-side compression
-- pipeline involved — a webp-only bucket would block that step entirely.
-- Task 13.6's WebP conversion is still the real production path for
-- customer-facing admin uploads through the app; this bucket-level MIME
-- restriction is a coarse safety net against arbitrary file types (e.g.
-- PDFs, executables), not a redundant re-enforcement of the WebP
-- conversion step specifically.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  1048576,
  array['image/jpeg', 'image/png', 'image/webp']
);

-- =========================================================================
-- Policies on storage.objects, scoped to this bucket
-- =========================================================================
-- Reuses private.is_admin() from 20260731011500_add_rls_policies.sql — not
-- redefined here.

-- Explicit select policy even though the bucket is public: a public bucket
-- serves objects regardless of RLS, but relying on that as the only control
-- would break the explicit-policy-per-role pattern used everywhere else in
-- this project (e.g. products_select_active_or_admin), and would leave this
-- table with no auditable policy if the bucket is ever flipped to private
-- later.
create policy product_images_select_all
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

create policy product_images_insert_admin
on storage.objects
for insert
to authenticated
with check (
  (select private.is_admin()) and bucket_id = 'product-images'
);

create policy product_images_update_admin
on storage.objects
for update
to authenticated
using ((select private.is_admin()) and bucket_id = 'product-images')
with check ((select private.is_admin()) and bucket_id = 'product-images');

create policy product_images_delete_admin
on storage.objects
for delete
to authenticated
using ((select private.is_admin()) and bucket_id = 'product-images');

-- No additional grant needed here. The previous migration already ran
-- `grant execute on function private.is_admin() to anon, authenticated`
-- (added so the anon branch of products_select_active_or_admin could call
-- it) — that grant already covers `authenticated`, which is the only role
-- the write policies above apply to. Nothing new to grant.

-- =========================================================================
-- Deferred to task 13.6
-- =========================================================================
-- File-path/naming convention is an open decision, not made here: whether
-- uploads are keyed by product id (deterministic overwrite, no orphan
-- cleanup needed) or use a generated name (requires explicit orphan
-- cleanup on failed/replaced uploads). This migration only grants access —
-- it does not constrain the object path/key shape.
