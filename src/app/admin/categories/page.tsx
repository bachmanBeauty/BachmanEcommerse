import type { Metadata } from "next";
import { Suspense } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "@/actions/admin-catalog";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Categories",
};

export default function AdminCategoriesPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <CategoriesContent />
    </Suspense>
  );
}

async function CategoriesContent() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Categories</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Group products so customers can browse by category.
      </p>

      <div className="mt-6 space-y-3">
        {(categories ?? []).map((category) => (
          <form
            key={category.id}
            action={updateCategory}
            className="grid items-end gap-2 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-6"
          >
            <input type="hidden" name="id" value={category.id} />
            <div className="sm:col-span-2">
              <Label htmlFor={`name-${category.id}`}>Name</Label>
              <Input id={`name-${category.id}`} name="name" defaultValue={category.name} required />
            </div>
            <div>
              <Label htmlFor={`slug-${category.id}`}>Slug</Label>
              <Input id={`slug-${category.id}`} name="slug" defaultValue={category.slug} required />
            </div>
            <div>
              <Label htmlFor={`sort-${category.id}`}>Sort</Label>
              <Input
                id={`sort-${category.id}`}
                name="sort_order"
                type="number"
                defaultValue={category.sort_order}
              />
            </div>
            <div>
              <Label htmlFor={`image-${category.id}`}>Image URL</Label>
              <Input id={`image-${category.id}`} name="image_url" defaultValue={category.image_url ?? ""} />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={category.is_active}
                />
                Active
              </label>
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="submit"
                formAction={deleteCategory}
                variant="outline"
                size="sm"
              >
                Delete
              </Button>
            </div>
            <div className="sm:col-span-6">
              <Label htmlFor={`description-${category.id}`}>Description</Label>
              <Input
                id={`description-${category.id}`}
                name="description"
                defaultValue={category.description ?? ""}
              />
            </div>
          </form>
        ))}
      </div>

      <form
        action={createCategory}
        className="mt-6 grid items-end gap-2 rounded-xl border border-dashed border-neutral-300 bg-white p-4 sm:grid-cols-6"
      >
        <div className="sm:col-span-2">
          <Label htmlFor="new-category-name">New category</Label>
          <Input id="new-category-name" name="name" placeholder="e.g. Eye care" required />
        </div>
        <div>
          <Label htmlFor="new-category-slug">Slug</Label>
          <Input id="new-category-slug" name="slug" placeholder="auto" />
        </div>
        <div>
          <Label htmlFor="new-category-sort">Sort</Label>
          <Input id="new-category-sort" name="sort_order" type="number" defaultValue={0} />
        </div>
        <div>
          <Label htmlFor="new-category-image">Image URL</Label>
          <Input id="new-category-image" name="image_url" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <Button type="submit" size="sm" variant="outline">
            Add category
          </Button>
        </div>
      </form>
    </div>
  );
}
