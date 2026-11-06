import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createProduct } from "@/actions/admin-catalog";
import { AdminLoading } from "@/components/admin/loading";
import { ProductForm } from "@/components/admin/product-form";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "New product",
};

export default function NewProductPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <NewProductContent />
    </Suspense>
  );
}

async function NewProductContent() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .order("sort_order");

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to products
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">New product</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Save the product first, then add variants and images.
      </p>
      <div className="mt-6">
        <ProductForm
          action={createProduct}
          categories={categories ?? []}
          submitLabel="Create product"
        />
      </div>
    </div>
  );
}
