import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminShell>{children}</AdminShell>
    </Suspense>
  );
}

async function AdminShell({ children }: { children: ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-semibold tracking-tight">
              Bachman Beauty Admin
            </Link>
            <nav className="hidden gap-4 text-sm text-neutral-600 sm:flex">
              <Link href="/admin" className="hover:text-neutral-900">
                Dashboard
              </Link>
              <Link href="/" className="hover:text-neutral-900">
                View store
              </Link>
            </nav>
          </div>
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <p className="text-sm text-neutral-500">Checking access…</p>
    </div>
  );
}
