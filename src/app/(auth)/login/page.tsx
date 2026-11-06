import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        Sign in to track orders and manage your account.
      </p>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </>
  );
}
