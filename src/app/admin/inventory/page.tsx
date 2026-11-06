import type { Metadata } from "next";
import { Suspense } from "react";
import { updateVariant } from "@/actions/admin-catalog";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Inventory",
};

export default function AdminInventoryPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <InventoryContent />
    </Suspense>
  );
}

async function InventoryContent() {
  const supabase = await createClient();
  const { data: variants } = await supabase
    .from("product_variants")
    .select(
      "id, name, sku, price, stock_quantity, is_active, product_id, products(name, slug)",
    )
    .order("stock_quantity", { ascending: true })
    .limit(200);

  const low = (variants ?? []).filter(
    (variant) => variant.stock_quantity <= 5,
  ).length;

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Update stock levels. {low} variant{low === 1 ? "" : "s"} at 5 or fewer.
      </p>

      <div className="mt-6 space-y-2">
        {(variants ?? []).map((variant) => {
          const product = Array.isArray(variant.products)
            ? variant.products[0]
            : variant.products;

          return (
            <form
              key={variant.id}
              action={updateVariant}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
            >
              <input type="hidden" name="id" value={variant.id} />
              <input type="hidden" name="product_id" value={variant.product_id} />
              <input type="hidden" name="name" value={variant.name} />
              <input type="hidden" name="sku" value={variant.sku ?? ""} />
              <input type="hidden" name="price" value={variant.price} />
              <input
                type="hidden"
                name="is_active"
                value={String(variant.is_active)}
              />

              <div className="min-w-40">
                <p className="text-sm font-medium text-neutral-900">
                  {product?.name ?? "Product"}
                </p>
                <p className="text-xs text-neutral-500">
                  {variant.name}
                  {variant.sku ? ` · ${variant.sku}` : ""}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Input
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={variant.stock_quantity}
                  className="h-9 w-24"
                  aria-label={`Stock for ${product?.name ?? "product"} ${variant.name}`}
                />
                <Button type="submit" size="sm" variant="outline">
                  Update
                </Button>
              </div>
            </form>
          );
        })}
        {(variants ?? []).length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-500">
            No variants yet. Add products and variants first.
          </p>
        )}
      </div>
    </div>
  );
}
