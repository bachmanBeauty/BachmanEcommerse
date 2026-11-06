import type { Metadata } from "next";
import { Suspense } from "react";
import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Banners",
};

const localDateTime = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default function AdminBannersPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <BannersContent />
    </Suspense>
  );
}

async function BannersContent() {
  const supabase = await createClient();
  const { data: banners } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Banners</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Homepage banners and promotional images.
      </p>

      <div className="mt-6 space-y-3">
        {(banners ?? []).map((banner) => (
          <form
            key={banner.id}
            action={updateBanner}
            className="grid items-end gap-2 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-6"
          >
            <input type="hidden" name="id" value={banner.id} />
            <div className="sm:col-span-2">
              <Label htmlFor={`title-${banner.id}`}>Title</Label>
              <Input id={`title-${banner.id}`} name="title" defaultValue={banner.title ?? ""} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor={`image-${banner.id}`}>Image URL</Label>
              <Input
                id={`image-${banner.id}`}
                name="image_url"
                defaultValue={banner.image_url}
                required
              />
            </div>
            <div>
              <Label htmlFor={`link-${banner.id}`}>Link</Label>
              <Input id={`link-${banner.id}`} name="link_url" defaultValue={banner.link_url ?? ""} />
            </div>
            <div>
              <Label htmlFor={`sort-${banner.id}`}>Sort</Label>
              <Input
                id={`sort-${banner.id}`}
                name="sort_order"
                type="number"
                defaultValue={banner.sort_order}
              />
            </div>
            <div className="sm:col-span-3">
              <Label htmlFor={`subtitle-${banner.id}`}>Subtitle</Label>
              <Input
                id={`subtitle-${banner.id}`}
                name="subtitle"
                defaultValue={banner.subtitle ?? ""}
              />
            </div>
            <div>
              <Label htmlFor={`starts-${banner.id}`}>Starts</Label>
              <Input
                id={`starts-${banner.id}`}
                name="starts_at"
                type="datetime-local"
                defaultValue={localDateTime(banner.starts_at)}
              />
            </div>
            <div>
              <Label htmlFor={`ends-${banner.id}`}>Ends</Label>
              <Input
                id={`ends-${banner.id}`}
                name="ends_at"
                type="datetime-local"
                defaultValue={localDateTime(banner.ends_at)}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={banner.is_active}
                />
                Active
              </label>
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="submit"
                formAction={deleteBanner}
                variant="outline"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createBanner}
        className="mt-6 grid items-end gap-2 rounded-xl border border-dashed border-neutral-300 bg-white p-4 sm:grid-cols-6"
      >
        <div className="sm:col-span-2">
          <Label htmlFor="new-banner-title">Title</Label>
          <Input id="new-banner-title" name="title" />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="new-banner-image">Image URL</Label>
          <Input id="new-banner-image" name="image_url" required />
        </div>
        <div>
          <Label htmlFor="new-banner-link">Link</Label>
          <Input id="new-banner-link" name="link_url" />
        </div>
        <div>
          <Label htmlFor="new-banner-sort">Sort</Label>
          <Input id="new-banner-sort" name="sort_order" type="number" defaultValue={0} />
        </div>
        <div className="sm:col-span-4">
          <Label htmlFor="new-banner-subtitle">Subtitle</Label>
          <Input id="new-banner-subtitle" name="subtitle" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <Button type="submit" size="sm" variant="outline">
            Add banner
          </Button>
        </div>
      </form>
    </div>
  );
}
