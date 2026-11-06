import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 px-6 py-12">
      <Link
        href="/"
        className="mb-8 text-2xl font-semibold tracking-tight text-neutral-900"
      >
        {siteConfig.name}
      </Link>
      <div className="w-full max-w-md rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
