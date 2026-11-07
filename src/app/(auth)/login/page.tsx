import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "সাইন ইন",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">ফিরে আসায় স্বাগতম</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        অর্ডার ট্র্যাক করতে ও অ্যাকাউন্ট দেখতে সাইন ইন করুন।
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
