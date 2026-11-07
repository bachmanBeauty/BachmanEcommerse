import type { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export const metadata: Metadata = {
  title: "পাসওয়ার্ড রিসেট",
};

export default function ForgotPasswordPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">পাসওয়ার্ড রিসেট</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        আপনার ইমেইল দিন, আমরা একটি রিসেট লিংক পাঠাব।
      </p>
      <ForgotPasswordForm />
    </>
  );
}
