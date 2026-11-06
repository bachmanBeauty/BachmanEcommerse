-- Phase 04 - sample catalog (optional, development only)
-- Only inserts when the products table is empty. Delete these products from
-- the admin panel once real ones are added.

insert into public.products (
  id, category_id, name, slug, sku, short_description, description,
  brand, ingredients, how_to_use, skin_type, base_price, compare_at_price,
  is_active, is_featured
)
select
  v.id::uuid,
  c.id,
  v.name,
  v.slug,
  v.sku,
  v.short_description,
  v.description,
  'Bachman Beauty',
  v.ingredients,
  v.how_to_use,
  v.skin_type,
  v.price::numeric(10, 2),
  v.compare_at::numeric(10, 2),
  true,
  true
from (
  values
    (
      'a1000000-0000-4000-8000-000000000001',
      'Gentle Gel Cleanser',
      'gentle-gel-cleanser',
      'BB-CLN-001',
      'cleanser',
      650,
      780,
      'A low-foam daily cleanser that removes dirt and excess oil without stripping.',
      'A gentle gel cleanser for everyday use. Rinses clean, leaves skin comfortable and ready for the rest of your routine.',
      'Aqua, Cocamidopropyl Betaine, Glycerin, Panthenol, Allantoin',
      'Massage onto damp skin morning and night. Rinse with lukewarm water.',
      array['Oily', 'Combination', 'Normal']
    ),
    (
      'a1000000-0000-4000-8000-000000000002',
      'Hydrating Toner',
      'hydrating-toner',
      'BB-TON-001',
      'toner',
      590,
      690,
      'Alcohol-free toner with hyaluronic acid and green tea for a calm, hydrated finish.',
      'A lightweight toner that adds a layer of hydration after cleansing and prepares skin for serum.',
      'Aqua, Glycerin, Sodium Hyaluronate, Camellia Sinensis Extract',
      'Apply a few drops to clean skin with your palms or a cotton pad.',
      array['Dry', 'Normal', 'Sensitive']
    ),
    (
      'a1000000-0000-4000-8000-000000000003',
      'Vitamin C Glow Serum',
      'vitamin-c-glow-serum',
      'BB-SER-001',
      'serum',
      1250,
      1450,
      'A brightening serum with 10% vitamin C to even out tone and boost radiance.',
      'A stable vitamin C serum formulated with ferulic acid and vitamin E for daily antioxidant support.',
      'Aqua, Ascorbic Acid, Ferulic Acid, Tocopherol, Glycerin',
      'Apply 3-4 drops to clean skin in the morning before moisturizer and sunscreen.',
      array['Normal', 'Combination', 'Oily']
    ),
    (
      'a1000000-0000-4000-8000-000000000004',
      'Ceramide Moisturizer',
      'ceramide-moisturizer',
      'BB-MOI-001',
      'moisturizer',
      890,
      990,
      'A ceramide-rich cream that supports the skin barrier and locks in moisture.',
      'A comfortable daily moisturizer with ceramides, squalane and glycerin for long-lasting hydration.',
      'Aqua, Glycerin, Squalane, Ceramide NP, Panthenol',
      'Smooth over face and neck morning and night as the last step of your routine.',
      array['Dry', 'Normal', 'Sensitive']
    ),
    (
      'a1000000-0000-4000-8000-000000000005',
      'Invisible Sunscreen SPF 50',
      'invisible-sunscreen-spf-50',
      'BB-SUN-001',
      'sunscreen',
      950,
      1100,
      'A lightweight, no-white-cast sunscreen for daily protection against UVA and UVB.',
      'A fast-absorbing sunscreen that sits well under makeup and suits humid weather.',
      'Aqua, Homosalate, Octocrylene, Niacinamide, Tocopherol',
      'Apply generously as the last step of your morning routine. Reapply every 2-3 hours outdoors.',
      array['All skin types']
    ),
    (
      'a1000000-0000-4000-8000-000000000006',
      'Clay Detox Mask',
      'clay-detox-mask',
      'BB-MSK-001',
      'face-mask',
      750,
      850,
      'A weekly kaolin and charcoal mask that helps clear congestion without over-drying.',
      'A creamy clay mask with kaolin, charcoal and aloe to refresh tired skin.',
      'Kaolin, Charcoal Powder, Aloe Barbadensis Leaf Juice, Glycerin',
      'Apply a thin layer to clean skin once or twice a week. Leave 10 minutes and rinse.',
      array['Oily', 'Combination']
    )
) as v(
  id, name, slug, sku, cat_slug, price, compare_at, short_description,
  description, ingredients, how_to_use, skin_type
)
left join public.categories c on c.slug = v.cat_slug
where not exists (select 1 from public.products);

insert into public.product_variants (
  id, product_id, name, sku, price, compare_at_price, stock_quantity
)
select
  v.id::uuid,
  v.product_id::uuid,
  v.name,
  v.sku,
  v.price::numeric(10, 2),
  v.compare_at::numeric(10, 2),
  v.stock
from (
  values
    ('b1000000-0000-4000-8000-000000000001', 'a1000000-0000-4000-8000-000000000001', '100 ml', 'BB-CLN-001-100', 650, 780, 25),
    ('b1000000-0000-4000-8000-000000000002', 'a1000000-0000-4000-8000-000000000002', '120 ml', 'BB-TON-001-120', 590, 690, 25),
    ('b1000000-0000-4000-8000-000000000003', 'a1000000-0000-4000-8000-000000000003', '30 ml', 'BB-SER-001-30', 1250, 1450, 25),
    ('b1000000-0000-4000-8000-000000000004', 'a1000000-0000-4000-8000-000000000004', '50 g', 'BB-MOI-001-50', 890, 990, 25),
    ('b1000000-0000-4000-8000-000000000005', 'a1000000-0000-4000-8000-000000000005', '50 ml', 'BB-SUN-001-50', 950, 1100, 25),
    ('b1000000-0000-4000-8000-000000000006', 'a1000000-0000-4000-8000-000000000006', '60 g', 'BB-MSK-001-60', 750, 850, 25)
) as v(id, product_id, name, sku, price, compare_at, stock)
join public.products p on p.id = v.product_id::uuid
on conflict (id) do nothing;
