-- Follow-up fix from Supabase security advisor (task 1.8):
-- public.set_updated_at() had a mutable search_path (WARN).
-- Aligns with private.is_admin() and public.place_order().

alter function public.set_updated_at() set search_path = '';
