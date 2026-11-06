import { createPublicClient } from "@/lib/supabase/public";
import type { Category, Product } from "@/types/catalog";

const productSelect = `
  id, name, slug, sku, short_description, description, brand, ingredients,
  how_to_use, skin_type, base_price, compare_at_price, is_featured, created_at,
  categories!inner ( id, name, slug ),
  product_images ( id, url, alt, is_primary, sort_order ),
  product_variants ( id, name, sku, price, compare_at_price, stock_quantity, is_active )
`;

export type ProductFilters = {
  query?: string;
  category?: string;
  sort?: "newest" | "price-asc" | "price-desc";
};

export async function getCategories(): Promise<Category[]> {  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as Category[];
}

export async function getProducts(
  filters: ProductFilters = {},
): Promise<Product[]> {
  const supabase = createPublicClient();
  let query = supabase
    .from("products")
    .select(productSelect)
    .eq("is_active", true)
    .is("deleted_at", null);

  if (filters.query) {
    query = query.ilike("name", `%${filters.query}%`);
  }

  if (filters.category) {
    query = query.eq("categories.slug", filters.category);
  }

  switch (filters.sort) {
    case "price-asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("base_price", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  return (data ?? []) as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("products")
    .select(productSelect)
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as unknown as Product) ?? null;
}

export type ShippingZone = {
  id: string;
  name: string;
  charge: number;
  estimated_days: string | null;
};

export async function getShippingZones(): Promise<ShippingZone[]> {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("shipping_zones")
    .select("id, name, charge, estimated_days")
    .eq("is_active", true)
    .order("charge", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as ShippingZone[];
}
