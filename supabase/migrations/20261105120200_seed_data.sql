-- Bachman Beauty - seed data
-- Safe defaults. Update the values from the admin panel later.

insert into public.site_settings (id, store_name, currency, tax_percentage)
values (1, 'Bachman Beauty', 'BDT', 0)
on conflict (id) do nothing;

insert into public.categories (name, slug, sort_order)
values
  ('Cleanser', 'cleanser', 10),
  ('Toner', 'toner', 20),
  ('Serum', 'serum', 30),
  ('Moisturizer', 'moisturizer', 40),
  ('Sunscreen', 'sunscreen', 50),
  ('Face Mask', 'face-mask', 60)
on conflict (slug) do nothing;

-- Placeholder delivery charges. Confirm the real values before launch.
insert into public.shipping_zones (name, charge, estimated_days)
values
  ('Inside Dhaka', 60, '1-2 days'),
  ('Outside Dhaka', 120, '2-4 days')
on conflict (name) do nothing;

-- To make a user an admin, run this after the user has signed up:
-- insert into public.user_roles (user_id, role)
-- values ('<auth-user-uuid>', 'admin')
-- on conflict (user_id) do update set role = 'admin';
