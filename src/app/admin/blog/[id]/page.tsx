import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deletePost, updatePost } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { PostForm } from "@/components/admin/post-form";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit post",
};

type PostPageProps = {
  params: Promise<{ id: string }>;
};

export default function EditPostPage({ params }: PostPageProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditPostContent params={params} />
    </Suspense>
  );
}

async function EditPostContent({ params }: PostPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!post) notFound();

  return (
    <div>
      <Link href="/admin/blog" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to blog
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">{post.title}</h1>
      <div className="mt-6">
        <PostForm action={updatePost} post={post} submitLabel="Save post" />
      </div>
      <form action={deletePost} className="mt-4">
        <input type="hidden" name="id" value={post.id} />
        <Button type="submit" variant="outline">
          Delete post
        </Button>
      </form>
    </div>
  );
}
