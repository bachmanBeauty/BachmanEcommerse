import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Blog",
};

export default function AdminBlogPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <BlogContent />
    </Suspense>
  );
}

async function BlogContent() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("id, title, slug, status, published_at, created_at")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Blog</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Skincare tips and store updates.
          </p>
        </div>
        <Link
          href="/admin/blog/new"
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
        >
          New post
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(posts ?? []).map((post) => (
              <tr key={post.id}>
                <td className="px-4 py-3">
                  <span className="block text-neutral-900">{post.title}</span>
                  <span className="text-xs text-neutral-500">/{post.slug}</span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      post.status === "published"
                        ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                        : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                    }
                  >
                    {post.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {post.published_at ? formatDate(post.published_at) : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(posts ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-neutral-500">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
