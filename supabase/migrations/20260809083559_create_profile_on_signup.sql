-- Areej — Create profile row on signup (task 5.6)
-- Keeps auth.users and public.profiles in sync via a trigger.
--
-- Why trigger (not client INSERT after signUp):
-- 1. profiles has no INSERT policy (RLS default-deny) — rows must be
--    created by SECURITY DEFINER code, not by the anon/authenticated client.
-- 2. Atomic with auth.users insert: no orphan auth user without a profile
--    if the client update fails or the session is missing.
-- 3. Works when email confirmation is enabled: signUp may return session=null,
--    so a follow-up client UPDATE of profiles would be unauthorized.
--
-- Why copy from raw_user_meta_data:
-- signUp({ options: { data } }) stores those fields on the auth user.
-- The trigger reads them once into profiles. Role is NEVER taken from
-- metadata — always the column default 'customer' (no self-service admin).
--
-- Function lives in `private` (unexposed), matching is_admin() — SECURITY
-- DEFINER must not live in public per the project security checklist.

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    phone,
    governorate,
    markaz,
    address_text
  )
  values (
    new.id,
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'phone', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'governorate', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'markaz', '')), ''),
    nullif(trim(coalesce(new.raw_user_meta_data ->> 'address_text', '')), '')
  );
  return new;
end;
$$;

comment on function private.handle_new_user() is
  'Signup: insert public.profiles row for new auth.users; copies safe fields from raw_user_meta_data.';

-- Trigger-only: no EXECUTE grants to anon/authenticated (private schema is
-- not exposed via PostgREST anyway).
revoke all on function private.handle_new_user() from public;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function private.handle_new_user();
