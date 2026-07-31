-- Follow-up fix from Supabase security advisor (task 1.8):
-- anon_security_definer_function_executable (WARN) on public.place_order.
--
-- 20260731011502 already revoked EXECUTE from PUBLIC and granted only to
-- authenticated. That is not enough on Supabase: creating a function in
-- `public` also applies default privileges that grant EXECUTE directly to
-- `anon` (and authenticated). REVOKE FROM PUBLIC does not remove that
-- role-specific grant, so anon could still hit /rest/v1/rpc/place_order.
-- The function body rejects null auth.uid(), but EXECUTE should not be
-- available to guests at all (spec: login required for checkout).

revoke execute on function public.place_order(jsonb, text, text, text, text, text)
from anon;
