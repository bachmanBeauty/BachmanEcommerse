import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Products",
};

export default function AdminProductsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ProductsContent />
    </Suspense>
  );
}

async function ProductsContent() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select(
      "id, name, slug, base_price, is_active, is_featured, deleted_at, categories(name), product_variants(stock_quantity)",
    )
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {products?.length ?? 0} products
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Add product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(products ?? []).map((product) => {
              const category = Array.isArray(product.categories)
                ? product.categories[0]
                : product.categories;
              const stock = (product.product_variants ?? []).reduce(
                (sum: number, variant: { stock_quantity: number }) =>
                  sum + variant.stock_quantity,
                0,
              );

              return (
                <tr key={product.id}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-neutral-900">
                      {product.name}
                    </span>
                    <span className="block text-xs text-neutral-500">
                      /{product.slug}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-600">
                    {category?.name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-neutral-900">
                    {formatPrice(product.base_price)}
                  </td>
                  <td className="px-4 py-3 text-neutral-600">{stock}</td>
                  <td className="px-4 py-3">
                    <span
                      className={
                        product.is_active
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                          : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                      }
                    >
                      {product.is_active ? "Active" : "Hidden"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-xs font-medium text-rose-600 hover:text-rose-700"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {(products ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No products yet. Add your first product.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
