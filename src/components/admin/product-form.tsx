import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type ProductFormValues = {
  id?: string;
  name?: string;
  slug?: string;
  sku?: string | null;
  category_id?: string | null;
  short_description?: string | null;
  description?: string | null;
  brand?: string | null;
  ingredients?: string | null;
  how_to_use?: string | null;
  skin_type?: string[] | null;
  base_price?: number;
  compare_at_price?: number | null;
  is_active?: boolean;
  is_featured?: boolean;
  meta_title?: string | null;
  meta_description?: string | null;
};

export function ProductForm({
  action,
  product,
  categories,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  product?: ProductFormValues;
  categories: { id: string; name: string }[];
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-6">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Basic details</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={product?.name ?? ""} required />
          </div>
          <div>
            <Label htmlFor="slug">Slug</Label>
            <Input id="slug" name="slug" defaultValue={product?.slug ?? ""} />
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input id="sku" name="sku" defaultValue={product?.sku ?? ""} />
          </div>
          <div>
            <Label htmlFor="category_id">Category</Label>
            <select
              id="category_id"
              name="category_id"
              defaultValue={product?.category_id ?? ""}
              className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm"
            >
              <option value="">Uncategorised</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Input id="brand" name="brand" defaultValue={product?.brand ?? ""} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="short_description">Short description</Label>
            <Input
              id="short_description"
              name="short_description"
              defaultValue={product?.short_description ?? ""}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              name="description"
              rows={4}
              defaultValue={product?.description ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Pricing</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="base_price">Price (৳)</Label>
            <Input
              id="base_price"
              name="base_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.base_price ?? 0}
              required
            />
          </div>
          <div>
            <Label htmlFor="compare_at_price">Compare-at price (৳)</Label>
            <Input
              id="compare_at_price"
              name="compare_at_price"
              type="number"
              min="0"
              step="0.01"
              defaultValue={product?.compare_at_price ?? ""}
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">Skincare details</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="ingredients">Key ingredients</Label>
            <textarea
              id="ingredients"
              name="ingredients"
              rows={3}
              defaultValue={product?.ingredients ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="how_to_use">How to use</Label>
            <textarea
              id="how_to_use"
              name="how_to_use"
              rows={3}
              defaultValue={product?.how_to_use ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <Label htmlFor="skin_type">Skin types (comma separated)</Label>
            <Input
              id="skin_type"
              name="skin_type"
              defaultValue={(product?.skin_type ?? []).join(", ")}
              placeholder="Oily, Dry, Combination"
            />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-5">
        <h2 className="text-sm font-semibold">SEO</h2>
        <div className="mt-4 grid gap-4">
          <div>
            <Label htmlFor="meta_title">Meta title</Label>
            <Input id="meta_title" name="meta_title" defaultValue={product?.meta_title ?? ""} />
          </div>
          <div>
            <Label htmlFor="meta_description">Meta description</Label>
            <textarea
              id="meta_description"
              name="meta_description"
              rows={2}
              defaultValue={product?.meta_description ?? ""}
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </section>

      <section className="flex flex-wrap items-center gap-6 rounded-xl border border-neutral-200 bg-white p-5">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
            className="h-4 w-4"
          />
          Active (visible in the shop)
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
            className="h-4 w-4"
          />
          Featured
        </label>
      </section>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
