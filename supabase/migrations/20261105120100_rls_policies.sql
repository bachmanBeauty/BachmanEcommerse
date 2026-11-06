-- Bachman Beauty - Row Level Security
-- Default deny: every table gets RLS, then explicit policies.

alter table public.profiles enable row level security;
alter table public.user_roles enable row level security;
alter table public.addresses enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.shipping_zones enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.coupon_redemptions enable row level security;
alter table public.order_status_history enable row level security;
alter table public.reviews enable row level security;
alter table public.wishlists enable row level security;
alter table public.banners enable row level security;
alter table public.blog_posts enable row level security;
alter table public.site_settings enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------------------------

drop policy if exists "profiles_select_own_or_admin" on public.profiles;
create policy "profiles_select_own_or_admin"
  on public.profiles for select
  to authenticated
  using (auth.uid() = id or public.is_admin());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "profiles_admin_all" on public.profiles;
create policy "profiles_admin_all"
  on public.profiles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- User roles (read-only for customers; admins manage)
-- ---------------------------------------------------------------------------

drop policy if exists "user_roles_select_own_or_admin" on public.user_roles;
create policy "user_roles_select_own_or_admin"
  on public.user_roles for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "user_roles_admin_all" on public.user_roles;
create policy "user_roles_admin_all"
  on public.user_roles for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Addresses
-- ---------------------------------------------------------------------------

drop policy if exists "addresses_own_all" on public.addresses;
create policy "addresses_own_all"
  on public.addresses for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "addresses_admin_all" on public.addresses;
create policy "addresses_admin_all"
  on public.addresses for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Catalog (public read for active rows)
-- ---------------------------------------------------------------------------

drop policy if exists "categories_public_read" on public.categories;
create policy "categories_public_read"
  on public.categories for select
  to anon, authenticated
  using (is_active);

drop policy if exists "categories_admin_all" on public.categories;
create policy "categories_admin_all"
  on public.categories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "products_public_read" on public.products;
create policy "products_public_read"
  on public.products for select
  to anon, authenticated
  using (is_active and deleted_at is null);

drop policy if exists "products_admin_all" on public.products;
create policy "products_admin_all"
  on public.products for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_variants_public_read" on public.product_variants;
create policy "product_variants_public_read"
  on public.product_variants for select
  to anon, authenticated
  using (
    is_active
    and exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active and p.deleted_at is null
    )
  );

drop policy if exists "product_variants_admin_all" on public.product_variants;
create policy "product_variants_admin_all"
  on public.product_variants for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "product_images_public_read" on public.product_images;
create policy "product_images_public_read"
  on public.product_images for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.products p
      where p.id = product_id and p.is_active and p.deleted_at is null
    )
  );

drop policy if exists "product_images_admin_all" on public.product_images;
create policy "product_images_admin_all"
  on public.product_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Shipping and coupons
-- ---------------------------------------------------------------------------

drop policy if exists "shipping_zones_public_read" on public.shipping_zones;
create policy "shipping_zones_public_read"
  on public.shipping_zones for select
  to anon, authenticated
  using (is_active);

drop policy if exists "shipping_zones_admin_all" on public.shipping_zones;
create policy "shipping_zones_admin_all"
  on public.shipping_zones for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- Coupons are validated on the server; no public read.
drop policy if exists "coupons_admin_all" on public.coupons;
create policy "coupons_admin_all"
  on public.coupons for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Orders
-- Orders are created and priced on the server (service role), so customers
-- never insert or update orders directly.
-- ---------------------------------------------------------------------------

drop policy if exists "orders_select_own_or_admin" on public.orders;
create policy "orders_select_own_or_admin"
  on public.orders for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "orders_admin_all" on public.orders;
create policy "orders_admin_all"
  on public.orders for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_items_select_own_or_admin" on public.order_items;
create policy "order_items_select_own_or_admin"
  on public.order_items for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_items_admin_all" on public.order_items;
create policy "order_items_admin_all"
  on public.order_items for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "payments_select_own_or_admin" on public.payments;
create policy "payments_select_own_or_admin"
  on public.payments for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "payments_admin_all" on public.payments;
create policy "payments_admin_all"
  on public.payments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "coupon_redemptions_select_own_or_admin" on public.coupon_redemptions;
create policy "coupon_redemptions_select_own_or_admin"
  on public.coupon_redemptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_admin());

drop policy if exists "coupon_redemptions_admin_all" on public.coupon_redemptions;
create policy "coupon_redemptions_admin_all"
  on public.coupon_redemptions for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "order_status_history_select_own_or_admin" on public.order_status_history;
create policy "order_status_history_select_own_or_admin"
  on public.order_status_history for select
  to authenticated
  using (
    exists (
      select 1 from public.orders o
      where o.id = order_id and (o.user_id = auth.uid() or public.is_admin())
    )
  );

drop policy if exists "order_status_history_admin_all" on public.order_status_history;
create policy "order_status_history_admin_all"
  on public.order_status_history for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Reviews
-- ---------------------------------------------------------------------------

drop policy if exists "reviews_public_read_approved" on public.reviews;
create policy "reviews_public_read_approved"
  on public.reviews for select
  to anon, authenticated
  using (is_approved or auth.uid() = user_id);

drop policy if exists "reviews_insert_own" on public.reviews;
create policy "reviews_insert_own"
  on public.reviews for insert
  to authenticated
  with check (auth.uid() = user_id and is_approved = false);

drop policy if exists "reviews_update_own" on public.reviews;
create policy "reviews_update_own"
  on public.reviews for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id and is_approved = false);

drop policy if exists "reviews_delete_own" on public.reviews;
create policy "reviews_delete_own"
  on public.reviews for delete
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "reviews_admin_all" on public.reviews;
create policy "reviews_admin_all"
  on public.reviews for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Wishlists
-- ---------------------------------------------------------------------------

drop policy if exists "wishlists_own_all" on public.wishlists;
create policy "wishlists_own_all"
  on public.wishlists for all
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

drop policy if exists "wishlists_admin_all" on public.wishlists;
create policy "wishlists_admin_all"
  on public.wishlists for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Content
-- ---------------------------------------------------------------------------

drop policy if exists "banners_public_read" on public.banners;
create policy "banners_public_read"
  on public.banners for select
  to anon, authenticated
  using (
    is_active
    and (starts_at is null or starts_at <= now())
    and (ends_at is null or ends_at >= now())
  );

drop policy if exists "banners_admin_all" on public.banners;
create policy "banners_admin_all"
  on public.banners for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "blog_posts_public_read" on public.blog_posts;
create policy "blog_posts_public_read"
  on public.blog_posts for select
  to anon, authenticated
  using (status = 'published' and published_at is not null and published_at <= now());

drop policy if exists "blog_posts_admin_all" on public.blog_posts;
create policy "blog_posts_admin_all"
  on public.blog_posts for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

drop policy if exists "site_settings_public_read" on public.site_settings;
create policy "site_settings_public_read"
  on public.site_settings for select
  to anon, authenticated
  using (true);

drop policy if exists "site_settings_admin_all" on public.site_settings;
create policy "site_settings_admin_all"
  on public.site_settings for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage buckets and policies
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp']),
  ('blog-images', 'blog-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "product_images_bucket_public_read" on storage.objects;
create policy "product_images_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'product-images');

drop policy if exists "product_images_bucket_admin_write" on storage.objects;
create policy "product_images_bucket_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

drop policy if exists "blog_images_bucket_public_read" on storage.objects;
create policy "blog_images_bucket_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'blog-images');

drop policy if exists "blog_images_bucket_admin_write" on storage.objects;
create policy "blog_images_bucket_admin_write"
  on storage.objects for all
  to authenticated
  using (bucket_id = 'blog-images' and public.is_admin())
  with check (bucket_id = 'blog-images' and public.is_admin());
