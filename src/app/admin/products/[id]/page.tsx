import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  addVariant,
  deleteProduct,
  deleteProductImage,
  deleteVariant,
  setPrimaryImage,
  updateProduct,
  updateVariant,
  uploadProductImage,
} from "@/actions/admin-catalog";
import { AdminLoading } from "@/components/admin/loading";
import { ProductForm } from "@/components/admin/product-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit product",
};

type EditProductProps = {
  params: Promise<{ id: string }>;
};

export default function EditProductPage({ params }: EditProductProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditProductContent params={params} />
    </Suspense>
  );
}

async function EditProductContent({ params }: EditProductProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!product) notFound();

  const [{ data: variants }, { data: images }, { data: categories }] =
    await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", id)
        .order("created_at"),
      supabase
        .from("product_images")
        .select("*")
        .eq("product_id", id)
        .order("sort_order"),
      supabase.from("categories").select("id, name").order("sort_order"),
    ]);

  return (
    <div>
      <Link href="/admin/products" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to products
      </Link>
      <div className=" mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
        <Link
          href={`/product/${product.slug}`}
          className="text-xs text-rose-600 hover:text-rose-700"
        >
          View on store →
        </Link>
      </div>

      <div className="mt-6">
        <ProductForm
          action={updateProduct}
          product={product}
          categories={categories ?? []}
          submitLabel="Save changes"
        />
      </div>

      <section className="mt-8 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Variants &amp; stock</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Each variant has its own price and stock level.
        </p>

        <div className="mt-4 space-y-3">
          {(variants ?? []).map((variant) => (
            <form
              key={variant.id}
              action={updateVariant}
              className="grid items-end gap-2 rounded-lg border border-neutral-200 p-3 sm:grid-cols-6"
            >
              <input type="hidden" name="id" value={variant.id} />
              <input type="hidden" name="product_id" value={product.id} />
              <div className="sm:col-span-2">
                <Label htmlFor={`name-${variant.id}`}>Name</Label>
                <Input id={`name-${variant.id}`} name="name" defaultValue={variant.name} required />
              </div>
              <div>
                <Label htmlFor={`sku-${variant.id}`}>SKU</Label>
                <Input id={`sku-${variant.id}`} name="sku" defaultValue={variant.sku ?? ""} />
              </div>
              <div>
                <Label htmlFor={`price-${variant.id}`}>Price</Label>
                <Input
                  id={`price-${variant.id}`}
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  defaultValue={variant.price}
                  required
                />
              </div>
              <div>
                <Label htmlFor={`stock-${variant.id}`}>Stock</Label>
                <Input
                  id={`stock-${variant.id}`}
                  name="stock_quantity"
                  type="number"
                  min="0"
                  defaultValue={variant.stock_quantity}
                  required
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    name="is_active"
                    defaultChecked={variant.is_active}
                  />
                  Active
                </label>
                <Button type="submit" size="sm">
                  Save
                </Button>
                <Button
                  type="submit"
                  formAction={deleteVariant}
                  variant="outline"
                  size="sm"
                >
                  Delete
                </Button>
              </div>
            </form>
          ))}

          {(variants ?? []).length === 0 && (
            <p className="text-sm text-neutral-500">
              No variants yet. Add one so customers can buy this product.
            </p>
          )}
        </div>

        <form
          action={addVariant}
          className="mt-4 grid items-end gap-2 rounded-lg border border-dashed border-neutral-300 p-3 sm:grid-cols-6"
        >
          <input type="hidden" name="product_id" value={product.id} />
          <div className="sm:col-span-2">
            <Label htmlFor="new-variant-name">New variant name</Label>
            <Input id="new-variant-name" name="name" placeholder="50 ml" required />
          </div>
          <div>
            <Label htmlFor="new-variant-sku">SKU</Label>
            <Input id="new-variant-sku" name="sku" />
          </div>
          <div>
            <Label htmlFor="new-variant-price">Price</Label>
            <Input
              id="new-variant-price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product.base_price}
              required
            />
          </div>
          <div>
            <Label htmlFor="new-variant-stock">Stock</Label>
            <Input
              id="new-variant-stock"
              name="stock_quantity"
              type="number"
              min="0"
              defaultValue={0}
              required
            />
          </div>
          <div>
            <Button type="submit" size="sm" variant="outline">
              Add variant
            </Button>
          </div>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Images</h2>
        <p className="mt-1 text-xs text-neutral-500">
          JPG, PNG or WebP up to 5 MB. The first image is used as the thumbnail.
        </p>

        {(images ?? []).length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {(images ?? []).map((image) => (
              <div key={image.id} className="rounded-lg border border-neutral-200 p-2">
                <div className="relative aspect-square overflow-hidden rounded-md bg-neutral-100">
                  <Image
                    src={image.url}
                    alt={image.alt ?? product.name}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  <form action={setPrimaryImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <Button type="submit" size="sm" variant="outline">
                      {image.is_primary ? "Primary" : "Set primary"}
                    </Button>
                  </form>
                  <form action={deleteProductImage}>
                    <input type="hidden" name="id" value={image.id} />
                    <input type="hidden" name="product_id" value={product.id} />
                    <input type="hidden" name="url" value={image.url} />
                    <Button type="submit" size="sm" variant="outline">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}

        <form action={uploadProductImage} className="mt-4 flex flex-wrap items-end gap-3">
          <input type="hidden" name="product_id" value={product.id} />
          <div>
            <Label htmlFor="image">Image file</Label>
            <input
              id="image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required
              className="block text-sm"
            />
          </div>
          <div>
            <Label htmlFor="alt">Alt text</Label>
            <Input id="alt" name="alt" placeholder="Optional" />
          </div>
          <Button type="submit" variant="outline">
            Upload image
          </Button>
        </form>
      </section>

      <section className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5">
        <h2 className="text-sm font-semibold text-red-800">Archive product</h2>
        <p className="mt-1 text-xs text-red-700">
          This hides the product from the shop. Existing orders are not affected.
        </p>
        <form action={deleteProduct} className="mt-3">
          <input type="hidden" name="id" value={product.id} />
          <button
            type="submit"
            className="rounded-full border border-red-300 bg-white px-4 py-2 text-xs font-medium text-red-700 hover:bg-red-100"
          >
            Archive product
          </button>
        </form>
      </section>
    </div>
  );
}
