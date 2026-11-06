import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";
import { daysAgoIso } from "@/lib/time";

export const metadata: Metadata = {
  title: "Reports",
};

export default function AdminReportsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ReportsContent />
    </Suspense>
  );
}

async function ReportsContent() {
  const supabase = await createClient();
  const since = daysAgoIso(30);

  const [{ data: orders }, { data: items }] = await Promise.all([
    supabase
      .from("orders")
      .select("id, total, status, payment_status, created_at")
      .gte("created_at", since)
      .limit(2000),
    supabase
      .from("order_items")
      .select("product_name, quantity, line_total, orders!inner(created_at, status)")
      .gte("orders.created_at", since)
      .limit(4000),
  ]);

  const validOrders = (orders ?? []).filter(
    (order) => !["cancelled", "returned"].includes(order.status),
  );
  const revenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );
  const average = validOrders.length ? revenue / validOrders.length : 0;

  const byDay = new Map<string, { orders: number; revenue: number }>();
  for (const order of validOrders) {
    const day = order.created_at.slice(0, 10);
    const entry = byDay.get(day) ?? { orders: 0, revenue: 0 };
    entry.orders += 1;
    entry.revenue += Number(order.total);
    byDay.set(day, entry);
  }
  const days = [...byDay.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1));

  const byProduct = new Map<string, { quantity: number; revenue: number }>();
  for (const item of items ?? []) {
    const entry = byProduct.get(item.product_name) ?? {
      quantity: 0,
      revenue: 0,
    };
    entry.quantity += item.quantity;
    entry.revenue += Number(item.line_total);
    byProduct.set(item.product_name, entry);
  }
  const products = [...byProduct.entries()]
    .sort((a, b) => b[1].revenue - a[1].revenue)
    .slice(0, 8);

  const stats = [
    { label: "Revenue (30d)", value: formatPrice(revenue) },
    { label: "Orders (30d)", value: String(validOrders.length) },
    { label: "Average order", value: formatPrice(average) },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Sales performance over the last 30 days.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
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

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-neutral-200 bg-white">
          <h2 className="border-b border-neutral-100 px-5 py-4 text-sm font-semibold">
            Daily sales
          </h2>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-neutral-500">
                <tr>
                  <th className="px-5 py-2">Date</th>
                  <th className="px-5 py-2">Orders</th>
                  <th className="px-5 py-2">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {days.map(([day, entry]) => (
                  <tr key={day}>
                    <td className="px-5 py-2 text-neutral-700">{day}</td>
                    <td className="px-5 py-2 text-neutral-600">{entry.orders}</td>
                    <td className="px-5 py-2 text-neutral-900">
                      {formatPrice(entry.revenue)}
                    </td>
                  </tr>
                ))}
                {days.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-5 py-8 text-center text-neutral-500">
                      No sales in this period.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white">
          <h2 className="border-b border-neutral-100 px-5 py-4 text-sm font-semibold">
            Top products
          </h2>
          <ul className="divide-y divide-neutral-100">
            {products.map(([name, entry]) => (
              <li key={name} className="flex items-center justify-between gap-3 px-5 py-3">
                <span className="text-sm text-neutral-800">{name}</span>
                <span className="text-right text-xs text-neutral-500">
                  {entry.quantity} sold
                  <span className="ml-2 text-sm text-neutral-900">
                    {formatPrice(entry.revenue)}
                  </span>
                </span>
              </li>
            ))}
            {products.length === 0 && (
              <li className="px-5 py-8 text-center text-sm text-neutral-500">
                No product sales yet.
              </li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
