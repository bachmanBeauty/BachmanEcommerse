import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#fff7ee] px-6 py-12">
      <Link
        href="/"
        className="mb-8 flex items-center gap-2.5 text-neutral-900"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-900 font-serif text-lg text-white">
          B
        </span>
        <span className="font-serif text-2xl tracking-tight">
          {siteConfig.name}
        </span>
      </Link>
      <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
        {children}
      </div>
    </div>
  );
}
