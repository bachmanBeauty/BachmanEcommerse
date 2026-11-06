-- Phase 06 - online payments, free shipping and courier fields

alter table public.orders
  add column if not exists courier_name text,
  add column if not exists courier_consignment_id text,
  add column if not exists courier_tracking_code text,
  add column if not exists courier_status text,
  add column if not exists courier_sent_at timestamptz;

create or replace function public.place_order(
  p_customer_name text,
  p_customer_phone text,
  p_customer_email text,
  p_shipping_address text,
  p_shipping_area text,
  p_shipping_city text,
  p_shipping_district text,
  p_shipping_postal_code text,
  p_shipping_zone_id uuid,
  p_payment_method public.payment_method,
  p_customer_note text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_order_id uuid;
  v_order_number text;
  v_subtotal numeric(10, 2) := 0;
  v_shipping numeric(10, 2);
  v_free_threshold numeric(10, 2);
  v_total numeric(10, 2);
  v_payment_status public.payment_status;
  v_item jsonb;
  v_variant record;
  v_qty integer;
  v_count integer := 0;
  v_user uuid := auth.uid();
begin
  if p_customer_name is null or length(trim(p_customer_name)) < 2 then
    raise exception 'Please enter your full name.';
  end if;

  if p_customer_phone is null or length(trim(p_customer_phone)) < 6 then
    raise exception 'Please enter a valid phone number.';
  end if;

  if p_shipping_address is null or length(trim(p_shipping_address)) < 10 then
    raise exception 'Please enter your full delivery address.';
  end if;

  if p_payment_method not in ('cod', 'sslcommerz') then
    raise exception 'Unsupported payment method.';
  end if;

  if p_items is null or jsonb_typeof(p_items) <> 'array' or jsonb_array_length(p_items) = 0 then
    raise exception 'Your bag is empty.';
  end if;

  select charge, free_shipping_threshold
    into v_shipping, v_free_threshold
    from public.shipping_zones
   where id = p_shipping_zone_id
     and is_active;

  if v_shipping is null then
    raise exception 'Please choose a valid delivery area.';
  end if;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := coalesce((v_item ->> 'quantity')::integer, 0);

    if v_qty < 1 or v_qty > 99 then
      raise exception 'Invalid quantity.';
    end if;

    select pv.id, pv.price, pv.stock_quantity, pv.name as variant_name,
           p.name as product_name, pv.sku
      into v_variant
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
     where pv.id = (v_item ->> 'variant_id')::uuid
       and pv.is_active
       and p.is_active
       and p.deleted_at is null
       for update of pv;

    if not found then
      raise exception 'A product in your bag is no longer available.';
    end if;

    if v_variant.stock_quantity < v_qty then
      raise exception 'Not enough stock for %.', v_variant.product_name;
    end if;

    v_subtotal := v_subtotal + (v_variant.price * v_qty);
    v_count := v_count + 1;
  end loop;

  if v_free_threshold is not null and v_subtotal >= v_free_threshold then
    v_shipping := 0;
  end if;

  v_total := v_subtotal + v_shipping;
  v_payment_status := case
    when p_payment_method = 'sslcommerz' then 'pending'::public.payment_status
    else 'unpaid'::public.payment_status
  end;

  insert into public.orders (
    user_id, customer_name, customer_phone, customer_email,
    shipping_address, shipping_area, shipping_city, shipping_district,
    shipping_postal_code, shipping_zone_id, subtotal, shipping_charge, total,
    status, payment_status, payment_method, customer_note
  )
  values (
    v_user, trim(p_customer_name), trim(p_customer_phone),
    nullif(trim(coalesce(p_customer_email, '')), ''),
    trim(p_shipping_address),
    nullif(trim(coalesce(p_shipping_area, '')), ''),
    trim(p_shipping_city),
    nullif(trim(coalesce(p_shipping_district, '')), ''),
    nullif(trim(coalesce(p_shipping_postal_code, '')), ''),
    p_shipping_zone_id, v_subtotal, v_shipping, v_total,
    'pending', v_payment_status, p_payment_method,
    nullif(trim(coalesce(p_customer_note, '')), '')
  )
  returning id, order_number
  into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(p_items)
  loop
    v_qty := (v_item ->> 'quantity')::integer;

    select pv.id, pv.price, pv.name as variant_name, pv.sku,
           p.id as product_id, p.name as product_name
      into v_variant
      from public.product_variants pv
      join public.products p on p.id = pv.product_id
     where pv.id = (v_item ->> 'variant_id')::uuid;

    insert into public.order_items (
      order_id, product_id, variant_id, product_name, variant_name, sku,
      unit_price, quantity, line_total
    )
    values (
      v_order_id, v_variant.product_id, v_variant.id, v_variant.product_name,
      v_variant.variant_name, v_variant.sku, v_variant.price, v_qty,
      v_variant.price * v_qty
    );

    update public.product_variants
       set stock_quantity = stock_quantity - v_qty
     where id = v_variant.id;
  end loop;

  insert into public.order_status_history (order_id, status, note, changed_by)
  values (v_order_id, 'pending', 'Order placed', v_user);

  return jsonb_build_object(
    'order_id', v_order_id,
    'order_number', v_order_number,
    'subtotal', v_subtotal,
    'shipping', v_shipping,
    'total', v_total,
    'item_count', v_count,
    'payment_method', p_payment_method,
    'payment_status', v_payment_status
  );
end;
$$;

revoke all on function public.place_order(
  text, text, text, text, text, text, text, text, uuid,
  public.payment_method, text, jsonb
) from public;

grant execute on function public.place_order(
  text, text, text, text, text, text, text, text, uuid,
  public.payment_method, text, jsonb
) to anon, authenticated;
