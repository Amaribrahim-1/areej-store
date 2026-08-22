-- Admin product edit (task 13.8).
-- get_admin_product: inactive included; missing id returns no row.
-- update_admin_product: product fields + a full desired variant list.
-- Variants with id are updated; without id are inserted; omitted ids are
-- deleted only when no order_items reference them (VARIANT_IN_USE otherwise).
-- SECURITY INVOKER: admin SELECT/UPDATE/INSERT/DELETE RLS already covers
-- both tables; non-admin is rejected before any write. Not SECURITY DEFINER.

create or replace function public.get_admin_product(p_product_id uuid)
returns table (
  id uuid,
  name text,
  slug text,
  description text,
  category text,
  category_label text,
  status text,
  image_url text,
  variants jsonb
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
    p.id,
    p.name,
    p.slug,
    p.description,
    p.category,
    cat.label,
    p.status,
    p.image_url,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', v.id,
            'volume_label', v.volume_label,
            'original_price', v.original_price,
            'current_price', v.current_price,
            'sort_order', v.sort_order
          )
          order by v.sort_order, v.id
        )
        from public.product_variants v
        where v.product_id = p.id
      ),
      '[]'::jsonb
    ) as variants
  from public.products p
  inner join public.categories cat on cat.slug = p.category
  where p.id = p_product_id;
end;
$$;

comment on function public.get_admin_product(uuid) is
  'Admin product edit: one product including inactive, plus variants ordered by sort_order. Missing id returns no row. Admin-only.';

revoke all on function public.get_admin_product(uuid) from public;
revoke all on function public.get_admin_product(uuid) from anon, authenticated;
grant execute on function public.get_admin_product(uuid) to authenticated;

create or replace function public.update_admin_product(
  p_id uuid,
  p_name text,
  p_slug text,
  p_description text,
  p_category text,
  p_status text,
  p_image_url text,
  p_variants jsonb
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_variant jsonb;
  v_index integer := 0;
  v_variant_id uuid;
  v_keep_ids uuid[] := '{}';
begin
  if not private.is_admin() then
    raise exception 'NOT_ADMIN';
  end if;

  if p_variants is null
    or jsonb_typeof(p_variants) <> 'array'
    or jsonb_array_length(p_variants) = 0 then
    raise exception 'INVALID_PRODUCT_PAYLOAD';
  end if;

  update public.products
  set
    name = p_name,
    slug = p_slug,
    description = p_description,
    category = p_category,
    status = p_status,
    image_url = p_image_url
  where id = p_id;

  if not found then
    raise exception 'PRODUCT_NOT_FOUND';
  end if;

  for v_variant in select * from jsonb_array_elements(p_variants)
  loop
    if nullif(btrim(coalesce(v_variant ->> 'id', '')), '') is not null then
      v_keep_ids := array_append(v_keep_ids, (v_variant ->> 'id')::uuid);
    end if;
  end loop;

  if exists (
    select 1
    from unnest(v_keep_ids) as keep_id
    group by keep_id
    having count(*) > 1
  ) then
    raise exception 'INVALID_PRODUCT_PAYLOAD';
  end if;

  if exists (
    select 1
    from unnest(v_keep_ids) as keep_id
    where not exists (
      select 1
      from public.product_variants pv
      where pv.id = keep_id
        and pv.product_id = p_id
    )
  ) then
    raise exception 'VARIANT_NOT_FOUND';
  end if;

  if exists (
    select 1
    from public.product_variants pv
    inner join public.order_items oi on oi.variant_id = pv.id
    where pv.product_id = p_id
      and not (pv.id = any (v_keep_ids))
  ) then
    raise exception 'VARIANT_IN_USE';
  end if;

  delete from public.product_variants pv
  where pv.product_id = p_id
    and not (pv.id = any (v_keep_ids));

  for v_variant in select * from jsonb_array_elements(p_variants)
  loop
    v_variant_id := nullif(btrim(coalesce(v_variant ->> 'id', '')), '')::uuid;

    if v_variant_id is null then
      insert into public.product_variants (
        product_id,
        volume_label,
        original_price,
        current_price,
        sort_order
      )
      values (
        p_id,
        nullif(btrim(coalesce(v_variant ->> 'volume_label', '')), ''),
        (v_variant ->> 'original_price')::numeric,
        (v_variant ->> 'current_price')::numeric,
        v_index
      );
    else
      update public.product_variants
      set
        volume_label = nullif(btrim(coalesce(v_variant ->> 'volume_label', '')), ''),
        original_price = (v_variant ->> 'original_price')::numeric,
        current_price = (v_variant ->> 'current_price')::numeric,
        sort_order = v_index
      where id = v_variant_id
        and product_id = p_id;
    end if;

    v_index := v_index + 1;
  end loop;

  return p_id;
end;
$$;

comment on function public.update_admin_product(
  uuid, text, text, text, text, text, text, jsonb
) is
  'Admin update: product fields plus a desired variant list. Omitted variants delete only when unused by order_items. Admin-only.';

revoke all on function public.update_admin_product(
  uuid, text, text, text, text, text, text, jsonb
) from public;
revoke all on function public.update_admin_product(
  uuid, text, text, text, text, text, text, jsonb
) from anon, authenticated;
grant execute on function public.update_admin_product(
  uuid, text, text, text, text, text, text, jsonb
) to authenticated;
