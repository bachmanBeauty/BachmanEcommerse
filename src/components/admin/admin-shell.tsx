"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/admin/icon";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: IconName };

const groups: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [{ href: "/admin", label: "Dashboard", icon: "grid" }],
  },
  {
    label: "Catalog",
    items: [
      { href: "/admin/products", label: "Products", icon: "box" },
      { href: "/admin/categories", label: "Categories", icon: "tag" },
      { href: "/admin/inventory", label: "Inventory", icon: "layers" },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: "cart" },
      { href: "/admin/payments", label: "Payments", icon: "wallet" },
      { href: "/admin/customers", label: "Customers", icon: "users" },
      { href: "/admin/coupons", label: "Coupons", icon: "ticket" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/reviews", label: "Reviews", icon: "star" },
      { href: "/admin/banners", label: "Banners", icon: "image" },
      { href: "/admin/blog", label: "Blog", icon: "file" },
    ],
  },
  {
    label: "Store",
    items: [
      { href: "/admin/delivery", label: "Delivery", icon: "truck" },
      { href: "/admin/reports", label: "Reports", icon: "chart" },
      { href: "/admin/settings", label: "Settings", icon: "settings" },
      { href: "/admin/roles", label: "Roles", icon: "shield" },
    ],
  },
];

export function AdminShell({
  email,
  signOutAction,
  children,
}: {
  email: string;
  signOutAction: () => Promise<void>;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const items = groups.flatMap((group) => group.items);
  const activeItem = [...items]
    .sort((a, b) => b.href.length - a.href.length)
    .find(
      (item) =>
        pathname === item.href ||
        (item.href !== "/admin" && pathname.startsWith(item.href)),
    );

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  const initials = (email || "BB").slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen bg-neutral-100">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-neutral-900/30 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200/80 bg-white transition-transform duration-200 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-neutral-100 px-4">
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-rose-700 font-serif text-lg text-white shadow-sm">
              B
            </span>
            <span>
              <span className="block font-serif text-base leading-tight text-neutral-900">
                Bachman Beauty
              </span>
              <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Admin
              </span>
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="rounded-lg p-2 text-neutral-500 hover:bg-neutral-100 lg:hidden"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                      isActive(item.href)
                        ? "bg-rose-50 font-medium text-rose-700 ring-1 ring-rose-100"
                        : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900",
                    )}
                  >
                    <Icon name={item.icon} className="h-[18px] w-[18px]" />
                    {item.label}
                    {isActive(item.href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-rose-500" />
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-neutral-100 p-3">
          <div className="rounded-xl bg-neutral-50 p-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
                {initials}
              </span>
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-neutral-900">
                  Signed in as
                </p>
                <p className="truncate text-[11px] text-neutral-500">{email}</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Link
                href="/"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-2 py-1.5 text-[11px] font-medium text-neutral-700 hover:bg-neutral-50"
              >
                <Icon name="external" className="h-3.5 w-3.5" /> Store
              </Link>
              <form action={signOutAction} className="flex-1">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-neutral-900 px-2 py-1.5 text-[11px] font-medium text-white hover:bg-neutral-800"
                >
                  <Icon name="logout" className="h-3.5 w-3.5" /> Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="rounded-lg p-2 text-neutral-700 hover:bg-neutral-100 lg:hidden"
            >
              <Icon name="menu" />
            </button>
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                Admin
              </p>
              <p className="text-sm font-medium text-neutral-900">
                {activeItem?.label ?? "Dashboard"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hidden items-center gap-1.5 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-xs text-neutral-700 hover:border-neutral-300 sm:flex"
            >
              <Icon name="external" className="h-3.5 w-3.5" /> View store
            </Link>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-semibold text-white">
              {initials}
            </span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
