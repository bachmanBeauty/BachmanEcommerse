import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "নতুন পাসওয়ার্ড",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">লোড হচ্ছে…</p>}>
      <ResetPasswordContent />
    </Suspense>
  );
}

async function ResetPasswordContent() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/forgot-password");
  }

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">নতুন পাসওয়ার্ড দিন</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        এমন একটি শক্তিশালী পাসওয়ার্ড বেছে নিন যা আগে ব্যবহার করেননি।
      </p>
      <ResetPasswordForm />
    </>
  );
}
