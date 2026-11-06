import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { getCurrentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Set a new password",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<p className="text-sm text-neutral-500">Loading…</p>}>
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
      <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        Choose a strong password you have not used before.
      </p>
      <ResetPasswordForm />
    </>
  );
}
