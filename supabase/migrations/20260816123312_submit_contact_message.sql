-- Areej — Contact form write path (tasks 10.2 / 10.3)
-- Public insert on contact_messages is a spam target (insert-anyone from
-- 1.3). The only writer becomes this SECURITY DEFINER RPC: re-checks payload
-- shape, strips HTML tags (same idea as sanitizePlainText), and rate-limits
-- by phone. Direct table INSERT from anon/authenticated is revoked.
-- No email delivery (backlog — same integration Forgot Password was deferred
-- for). Admin SELECT policy from 1.3 is unchanged.

create or replace function public.submit_contact_message(
  p_name text,
  p_phone text,
  p_message text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name text;
  v_phone text;
  v_message text;
  v_stripped text;
  v_recent integer;
  v_id uuid;
begin
  v_name := coalesce(p_name, '');
  v_phone := btrim(coalesce(p_phone, ''));
  v_message := coalesce(p_message, '');

  -- Repeat until stable so nested / broken tags cannot leave markup behind.
  loop
    v_stripped := regexp_replace(
      v_name,
      '</?[a-zA-Z][a-zA-Z0-9]*[^>]*>',
      '',
      'g'
    );
    exit when v_stripped = v_name;
    v_name := v_stripped;
  end loop;
  v_name := btrim(v_name);

  loop
    v_stripped := regexp_replace(
      v_message,
      '</?[a-zA-Z][a-zA-Z0-9]*[^>]*>',
      '',
      'g'
    );
    exit when v_stripped = v_message;
    v_message := v_stripped;
  end loop;
  v_message := btrim(v_message);

  if char_length(v_name) < 2 or char_length(v_name) > 80 then
    raise exception 'INVALID_CONTACT_PAYLOAD';
  end if;

  if v_phone !~ '^01[0125][0-9]{8}$' then
    raise exception 'INVALID_CONTACT_PAYLOAD';
  end if;

  if char_length(v_message) < 10 or char_length(v_message) > 1000 then
    raise exception 'INVALID_CONTACT_PAYLOAD';
  end if;

  select count(*)::integer
  into v_recent
  from public.contact_messages
  where phone = v_phone
    and created_at > now() - interval '1 hour';

  if coalesce(v_recent, 0) >= 3 then
    raise exception 'CONTACT_RATE_LIMITED';
  end if;

  insert into public.contact_messages (name, phone, message)
  values (v_name, v_phone, v_message)
  returning id into v_id;

  return v_id;
end;
$$;

comment on function public.submit_contact_message(text, text, text) is
  'Public contact form: sanitize + validate + insert, max 3 messages per phone per hour.';

revoke all on function public.submit_contact_message(text, text, text) from public;
revoke all on function public.submit_contact_message(text, text, text) from anon, authenticated;
grant execute on function public.submit_contact_message(text, text, text) to anon, authenticated;

drop policy if exists contact_messages_insert_anyone on public.contact_messages;

revoke insert on table public.contact_messages from anon, authenticated;

create index if not exists idx_contact_messages_phone_created_at
  on public.contact_messages (phone, created_at desc);
