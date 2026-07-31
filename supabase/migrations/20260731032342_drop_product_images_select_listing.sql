-- Follow-up fix from Supabase security advisor (task 1.8):
-- public_bucket_allows_listing (WARN) on bucket `product-images`.
--
-- 20260731011501 added product_images_select_all for an "explicit policy
-- per role" audit trail. That SELECT also lets anon/authenticated *list*
-- every object in the bucket via the Storage API — broader than needed.
-- Public buckets already serve known object URLs without a SELECT policy
-- (advisor lint 0025). Dropping the policy keeps image URLs working
-- (products.image_url → next/image) while blocking bucket enumeration.
-- Admin write policies (insert/update/delete) are unchanged.

drop policy if exists product_images_select_all on storage.objects;
