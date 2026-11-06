import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { updatePaymentStatus } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Payments",
};

const statuses = ["unpaid", "pending", "paid", "failed", "refunded"];

export default function AdminPaymentsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <PaymentsContent />
    </Suspense>
  );
}

async function PaymentsContent() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, total, payment_method, payment_status, created_at",
    )
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Track and update payment status for each order.
      </p>

      <div className="mt-6 space-y-2">
        {(orders ?? []).map((order) => (
          <form
            key={order.id}
            action={updatePaymentStatus}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3"
          >
            <input type="hidden" name="order_id" value={order.id} />
            <div className="min-w-40">
              <Link
                href={`/admin/orders/${order.id}`}
                className="font-mono text-xs text-neutral-900 hover:text-rose-600"
              >
                {order.order_number}
              </Link>
              <p className="text-xs text-neutral-500">
                {order.customer_name} · {formatDate(order.created_at)}
              </p>
            </div>
            <div className="text-sm text-neutral-900">
              {formatPrice(order.total)}
              <span className="ml-2 text-xs uppercase text-neutral-500">
                {order.payment_method}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <select
                name="payment_status"
                defaultValue={order.payment_status}
                className="h-9 rounded-md border border-neutral-300 px-2 text-xs capitalize"
                aria-label={`Payment status for ${order.order_number}`}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <Button type="submit" size="sm" variant="outline">
                Save
              </Button>
            </div>
          </form>
        ))}
        {(orders ?? []).length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-500">
            No payments yet.
          </p>
        )}
      </div>
    </div>
  );
}
