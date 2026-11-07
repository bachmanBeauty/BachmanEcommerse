import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icon, type IconName } from "@/components/admin/icon";
import { AdminLoading } from "@/components/admin/loading";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { daysAgoIso } from "@/lib/time";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 ring-amber-100",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-100",
  processing: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  shipped: "bg-violet-50 text-violet-700 ring-violet-100",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  cancelled: "bg-red-50 text-red-700 ring-red-100",
  returned: "bg-neutral-100 text-neutral-600 ring-neutral-200",
};

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const supabase = await createClient();
  const since = daysAgoIso(30);

  const [products, orders, customers, reviews, lowStock, recent, sales] =
    await Promise.all([
      supabase
        .from("products")
        .select("id", { count: "exact", head: true })
        .is("deleted_at", null),
      supabase.from("orders").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase
        .from("reviews")
        .select("id", { count: "exact", head: true })
        .eq("is_approved", false),
      supabase
        .from("product_variants")
        .select("id, name, stock_quantity, products(name, slug)")
        .lte("stock_quantity", 5)
        .order("stock_quantity", { ascending: true })
        .limit(6),
      supabase
        .from("orders")
        .select(
          "id, order_number, customer_name, total, status, payment_status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(6),
      supabase
        .from("orders")
        .select("total, status, payment_status")
        .gte("created_at", since)
        .limit(2000),
    ]);

  const salesRows = sales.data ?? [];
  const revenue = salesRows
    .filter((order) => !["cancelled", "returned"].includes(order.status))
    .reduce((sum, order) => sum + Number(order.total), 0);
  const paid = salesRows
    .filter((order) => order.payment_status === "paid")
    .reduce((sum, order) => sum + Number(order.total), 0);

  const stats: {
    label: string;
    value: string;
    note: string;
    icon: IconName;
    tint: string;
  }[] = [
    {
      label: "Revenue",
      value: formatPrice(revenue),
      note: "Last 30 days",
      icon: "chart",
      tint: "bg-rose-50 text-rose-600",
    },
    {
      label: "Paid online",
      value: formatPrice(paid),
      note: "Last 30 days",
      icon: "wallet",
      tint: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Orders",
      value: String(orders.count ?? 0),
      note: "All time",
      icon: "cart",
      tint: "bg-sky-50 text-sky-600",
    },
    {
      label: "Products",
      value: String(products.count ?? 0),
      note: "Active catalog",
      icon: "box",
      tint: "bg-amber-50 text-amber-600",
    },
    {
      label: "Customers",
      value: String(customers.count ?? 0),
      note: "Registered accounts",
      icon: "users",
      tint: "bg-violet-50 text-violet-600",
    },
    {
      label: "Pending reviews",
      value: String(reviews.count ?? 0),
      note: "Need approval",
      icon: "star",
      tint: "bg-orange-50 text-orange-600",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-rose-600">
            Overview
          </p>
          <h1 className="mt-1 font-serif text-3xl tracking-tight text-neutral-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-neutral-500">
            A clear look at your store&apos;s performance.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <Icon name="plus" className="h-4 w-4" /> Add product
          </Link>
          <Link
            href="/admin/orders"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:border-neutral-300"
          >
            View orders <Icon name="arrow" className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-sm shadow-neutral-200/40 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-500">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-neutral-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-xs text-neutral-400">{stat.note}</p>
              </div>
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                  stat.tint,
                )}
              >
                <Icon name={stat.icon} className="h-5 w-5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/40">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Recent orders
              </h2>
              <p className="text-xs text-neutral-500">
                Latest activity from your store
              </p>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              View all <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="divide-y divide-neutral-100">
            {(recent.data ?? []).map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-neutral-50/70"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600">
                    {(order.customer_name || "BB").slice(0, 2).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">
                      {order.customer_name}
                    </p>
                    <p className="truncate font-mono text-[11px] text-neutral-400">
                      {order.order_number} · {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1",
                        statusStyles[order.status] ??
                          "bg-neutral-100 text-neutral-600 ring-neutral-200",
                      )}
                    >
                      {order.status}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
            {(recent.data ?? []).length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-neutral-500">
                No orders yet. Share your store to get started.
              </li>
            )}
          </ul>
        </section>

        <section className="overflow-hidden rounded-2xl border border-neutral-200/80 bg-white shadow-sm shadow-neutral-200/40">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900">
                Low stock
              </h2>
              <p className="text-xs text-neutral-500">5 or fewer remaining</p>
            </div>
            <Link
              href="/admin/inventory"
              className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 hover:text-rose-700"
            >
              Manage <Icon name="arrow" className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="divide-y divide-neutral-100">
            {(lowStock.data ?? []).map((variant) => {
              const product = Array.isArray(variant.products)
                ? variant.products[0]
                : variant.products;
              return (
                <li
                  key={variant.id}
                  className="flex items-center justify-between gap-3 px-5 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-neutral-800">
                      {product?.name ?? "Product"}
                    </p>
                    <p className="text-[11px] text-neutral-400">{variant.name}</p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium",
                      variant.stock_quantity === 0
                        ? "bg-red-50 text-red-700"
                        : "bg-amber-50 text-amber-700",
                    )}
                  >
                    {variant.stock_quantity === 0
                      ? "Out of stock"
                      : `${variant.stock_quantity} left`}
                  </span>
                </li>
              );
            })}
            {(lowStock.data ?? []).length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-neutral-500">
                Stock levels look healthy.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
