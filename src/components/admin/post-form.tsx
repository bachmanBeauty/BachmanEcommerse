import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type PostValues = {
  id?: string;
  title?: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  status?: string;
  published_at?: string | null;
  meta_title?: string | null;
  meta_description?: string | null;
};

const localDateTime = (value?: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => Promise<void>;
  post?: PostValues;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-4">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-4 rounded-xl border border-neutral-200 bg-white p-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="title">Title</Label>
          <Input id="title" name="title" defaultValue={post?.title ?? ""} required />
        </div>
        <div>
          <Label htmlFor="slug">Slug</Label>
          <Input id="slug" name="slug" defaultValue={post?.slug ?? ""} />
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            name="status"
            defaultValue={post?.status ?? "draft"}
            className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
        <div>
          <Label htmlFor="published_at">Publish date</Label>
          <Input
            id="published_at"
            name="published_at"
            type="datetime-local"
            defaultValue={localDateTime(post?.published_at)}
          />
        </div>
        <div>
          <Label htmlFor="cover_image_url">Cover image URL</Label>
          <Input
            id="cover_image_url"
            name="cover_image_url"
            defaultValue={post?.cover_image_url ?? ""}
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="excerpt">Excerpt</Label>
          <Input id="excerpt" name="excerpt" defaultValue={post?.excerpt ?? ""} />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            name="content"
            rows={12}
            defaultValue={post?.content ?? ""}
            className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
          />
        </div>
        <div>
          <Label htmlFor="meta_title">Meta title</Label>
          <Input id="meta_title" name="meta_title" defaultValue={post?.meta_title ?? ""} />
        </div>
        <div>
          <Label htmlFor="meta_description">Meta description</Label>
          <Input
            id="meta_description"
            name="meta_description"
            defaultValue={post?.meta_description ?? ""}
          />
        </div>
      </div>

      <Button type="submit" size="lg">
        {submitLabel}
      </Button>
    </form>
  );
}
