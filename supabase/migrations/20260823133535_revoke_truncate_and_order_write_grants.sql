-- Security review (task 15.3).
--
-- Postgres TRUNCATE is not subject to RLS. Supabase default grants give
-- anon and authenticated TRUNCATE on every public table, and ALTER DEFAULT
-- PRIVILEGES repeats that for future tables. The Data API does not expose
-- TRUNCATE, but the privilege still exists on those roles. Revoke it now
-- and stop new tables from inheriting it.
--
-- Orders / order_items are written only by public.place_order (SECURITY
-- DEFINER). Direct INSERT/DELETE grants are leftover from the default
-- GRANT ALL; missing RLS policies already block those writes. Drop the
-- grants so a future policy cannot accidentally open a client write path.
-- authenticated keeps UPDATE (status) for the admin status control — RLS
-- still requires private.is_admin().

revoke truncate on all tables in schema public from anon, authenticated;

alter default privileges for role postgres in schema public
  revoke truncate on tables from anon, authenticated;

revoke insert, delete on table public.orders from anon, authenticated;
revoke insert, update, delete on table public.order_items from anon, authenticated;
