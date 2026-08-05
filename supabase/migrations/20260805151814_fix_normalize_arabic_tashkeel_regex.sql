-- Harden tashkeel/tatweel stripping with chr() ranges (portable Postgres, no \u escapes).

create or replace function private.normalize_arabic(input text)
returns text
language sql
immutable
parallel safe
set search_path = ''
as $$
  select lower(
    replace(
      replace(
        replace(
          replace(
            translate(
              regexp_replace(
                coalesce(input, ''),
                '[' || chr(1611) || '-' || chr(1631) || chr(1648) || chr(1600) || ']',
                '',
                'g'
              ),
              'أإآٱٲٳ',
              'اااااا'
            ),
            'ة',
            'ه'
          ),
          'ى',
          'ي'
        ),
        'ؤ',
        'و'
      ),
      'ئ',
      'ي'
    )
  );
$$;

revoke all on function private.normalize_arabic(text) from public;
grant execute on function private.normalize_arabic(text) to anon, authenticated;
