export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type ProductImage = {
  id: string;
  url: string;
  alt: string | null;
  is_primary: boolean;
  sort_order: number;
};

export type ProductVariant = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  is_active: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku: string | null;
  short_description: string | null;
  description: string | null;
  brand: string | null;
  ingredients: string | null;
  how_to_use: string | null;
  skin_type: string[] | null;
  base_price: number;
  compare_at_price: number | null;
  is_featured: boolean;
  created_at: string;
  categories: Category | null;
  product_images: ProductImage[];
  product_variants: ProductVariant[];
};

export type TrackingItem = {
  name: string;
  variant: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
};

export type TrackedOrder = {
  order_number: string;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
  payment_status: string;
  payment_method: string;
  total: number;
  subtotal: number;
  shipping_charge: number;
  created_at: string;
  customer_name: string;
  shipping_city: string;
  items: TrackingItem[];
};
