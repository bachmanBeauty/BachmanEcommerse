import type { Metadata } from "next";
import Link from "next/link";
import { createPost } from "@/actions/admin-store";
import { PostForm } from "@/components/admin/post-form";

export const metadata: Metadata = {
  title: "New post",
};

export default function NewPostPage() {
  return (
    <div>
      <Link href="/admin/blog" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to blog
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">New post</h1>
      <div className="mt-6">
        <PostForm action={createPost} submitLabel="Create post" />
      </div>
    </div>
  );
}
