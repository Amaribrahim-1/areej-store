-- Admin contact inbox (Phase A gap).
-- SECURITY INVOKER: contact_messages already has admin-only SELECT RLS
-- (`contact_messages_select_admin`). The is_admin() guard makes a non-admin
-- call fail with NOT_ADMIN instead of returning [] under RLS — same contract
-- as list_admin_orders. Not SECURITY DEFINER: no profiles join, no need to
-- bypass RLS, and public definer RPCs belong in `private`.

create or replace function public.list_admin_contact_messages()
returns table (
  id uuid,
  name text,
  phone text,
  message text,
  created_at timestamptz
)
language plpgsql
stable
security invoker
set search_path = ''
as $$
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  return query
  select
    m.id,
    m.name,
    m.phone,
    m.message,
    m.created_at
  from public.contact_messages m
  order by m.created_at desc, m.id desc;
end;
$$;

comment on function public.list_admin_contact_messages() is
  'Admin contact inbox: all messages, newest first. Admin-only.';

revoke all on function public.list_admin_contact_messages() from public;
revoke all on function public.list_admin_contact_messages() from anon, authenticated;
grant execute on function public.list_admin_contact_messages() to authenticated;

-- Admin list is newest-first across every message; the phone+created_at
-- rate-limit index does not cover that scan.
create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);
