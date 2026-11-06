import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";

const navigation = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/inventory", label: "Inventory" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/payments", label: "Payments" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/coupons", label: "Coupons" },
  { href: "/admin/delivery", label: "Delivery" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/banners", label: "Banners" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/reports", label: "Reports" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/roles", label: "Roles" },
];

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <Link href="/admin" className="shrink-0 font-semibold tracking-tight">
            Bachman Beauty Admin
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="text-xs text-neutral-600 hover:text-neutral-900"
            >
              View store
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="outline" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-4 overflow-x-auto px-4 pb-2 text-xs">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap py-1 text-neutral-600 hover:text-neutral-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
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
