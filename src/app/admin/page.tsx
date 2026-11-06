import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { daysAgoIso } from "@/lib/time";

export const metadata: Metadata = {
  title: "Admin dashboard",
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
        .limit(8),
      supabase
        .from("orders")
        .select(
          "id, order_number, customer_name, total, status, payment_status, created_at",
        )
        .order("created_at", { ascending: false })
        .limit(8),
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

  const stats = [
    { label: "Revenue (30 days)", value: formatPrice(revenue) },
    { label: "Paid (30 days)", value: formatPrice(paid) },
    { label: "Orders", value: String(orders.count ?? 0) },
    { label: "Products", value: String(products.count ?? 0) },
    { label: "Customers", value: String(customers.count ?? 0) },
    { label: "Pending reviews", value: String(reviews.count ?? 0) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">
        A quick look at your store right now.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <p className="text-xs uppercase tracking-wide text-neutral-500">
              {stat.label}
            </p>
            <p className="mt-2 text-2xl font-semibold text-neutral-900">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold">Recent orders</h2>
            <Link
              href="/admin/orders"
              className="text-xs text-rose-600 hover:text-rose-700"
            >
              View all
            </Link>
          </div>
          <ul className="divide-y divide-neutral-100">
            {(recent.data ?? []).map((order) => (
              <li key={order.id}>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between gap-3 px-5 py-3 hover:bg-neutral-50"
                >
                  <span>
                    <span className="block font-mono text-xs text-neutral-900">
                      {order.order_number}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {order.customer_name} · {formatDate(order.created_at)}
                    </span>
                  </span>
                  <span className="text-right">
                    <span className="block text-sm text-neutral-900">
                      {formatPrice(order.total)}
                    </span>
                    <span className="text-[11px] capitalize text-neutral-500">
                      {order.status}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
            {(recent.data ?? []).length === 0 && (
              <li className="px-5 py-6 text-sm text-neutral-500">
                No orders yet.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
            <h2 className="text-sm font-semibold">Low stock</h2>
            <Link
              href="/admin/inventory"
              className="text-xs text-rose-600 hover:text-rose-700"
            >
              Manage
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
                  <span className="text-sm text-neutral-800">
                    {product?.name ?? "Product"}
                    <span className="text-neutral-500"> · {variant.name}</span>
                  </span>
                  <span
                    className={
                      variant.stock_quantity === 0
                        ? "rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700"
                        : "rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700"
                    }
                  >
                    {variant.stock_quantity} left
                  </span>
                </li>
              );
            })}
            {(lowStock.data ?? []).length === 0 && (
              <li className="px-5 py-6 text-sm text-neutral-500">
                Stock levels look healthy.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
