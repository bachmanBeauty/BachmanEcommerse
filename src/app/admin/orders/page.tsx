import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Orders",
};

const badge: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-sky-50 text-sky-700",
  processing: "bg-indigo-50 text-indigo-700",
  shipped: "bg-violet-50 text-violet-700",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
  returned: "bg-neutral-200 text-neutral-700",
};

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <OrdersContent />
    </Suspense>
  );
}

async function OrdersContent() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_phone, total, status, payment_status, payment_method, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      <p className="mt-1 text-sm text-neutral-600">
        {orders?.length ?? 0} recent orders
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(orders ?? []).map((order) => (
              <tr key={order.id}>
                <td className="px-4 py-3">
                  <span className="block font-mono text-xs text-neutral-900">
                    {order.order_number}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {formatDate(order.created_at)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="block text-neutral-800">{order.customer_name}</span>
                  <span className="text-xs text-neutral-500">{order.customer_phone}</span>
                </td>
                <td className="px-4 py-3 font-medium text-neutral-900">
                  {formatPrice(order.total)}
                </td>
                <td className="px-4 py-3 text-xs capitalize text-neutral-600">
                  {order.payment_method} · {order.payment_status}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${badge[order.status] ?? "bg-neutral-100 text-neutral-600"}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-neutral-500">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
