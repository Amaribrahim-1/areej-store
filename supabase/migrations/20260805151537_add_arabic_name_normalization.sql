-- Arabic-friendly catalog search: normalize alef/hamza variants, taa marbuta,
-- alif maqsura, and strip tashkeel/tatweel so "الاسود" matches "الأسود".
-- Keep TypeScript normalizeArabic() in features/products in sync with this SQL.

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
              -- Tashkeel U+064B..U+065F, superscript alef U+0670, tatweel U+0640
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

comment on function private.normalize_arabic(text) is
  'Normalize Arabic text for catalog search (alef/hamza, ة/ه, ى/ي, strip diacritics).';

revoke all on function private.normalize_arabic(text) from public;
grant execute on function private.normalize_arabic(text) to anon, authenticated;

-- Recreate catalog view with a searchable normalized name column.
create or replace view public.catalog_products
with (security_invoker = true) as
select
  p.id,
  p.name,
  p.slug,
  p.description,
  p.category,
  p.image_url,
  p.status,
  p.created_at,
  p.updated_at,
  dv.current_price as display_current_price,
  dv.original_price as display_original_price,
  rv.average_rating,
  coalesce(rv.review_count, 0) as review_count,
  private.normalize_arabic(p.name) as name_normalized
from public.products p
inner join lateral (
  select v.current_price, v.original_price
  from public.product_variants v
  where v.product_id = p.id
  order by v.current_price asc, v.sort_order asc
  limit 1
) dv on true
left join lateral (
  select
    round(avg(r.rating)::numeric, 2) as average_rating,
    count(*)::integer as review_count
  from public.reviews r
  where r.product_id = p.id
) rv on true;

comment on view public.catalog_products is
  'Storefront catalog row: product + display price pair + review aggregates + name_normalized for search.';

grant select on public.catalog_products to anon, authenticated;
