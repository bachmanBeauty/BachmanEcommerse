import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import {
  sendToCourier,
  updateOrderNote,
  updateOrderStatus,
  updatePaymentStatus,
} from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { isSteadfastEnabled } from "@/lib/courier/steadfast";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Order details",
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
};

const statuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
];

const paymentStatuses = ["unpaid", "pending", "paid", "failed", "refunded"];

export default function AdminOrderPage({ params }: OrderPageProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <OrderContent params={params} />
    </Suspense>
  );
}

async function OrderContent({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) notFound();

  const courierEnabled = isSteadfastEnabled();

  const [{ data: items }, { data: history }] = await Promise.all([
    supabase.from("order_items").select("*").eq("order_id", id),
    supabase
      .from("order_status_history")
      .select("*")
      .eq("order_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <Link href="/admin/orders" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to orders
      </Link>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-mono text-2xl font-semibold tracking-tight">
          {order.order_number}
        </h1>
        <span className="text-xs text-neutral-500">
          {formatDate(order.created_at)} · {order.payment_method.toUpperCase()}
        </span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Customer &amp; delivery</h2>
            <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-neutral-500">Name</dt>
                <dd className="text-neutral-900">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs text-neutral-500">Phone</dt>
                <dd className="text-neutral-900">{order.customer_phone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-neutral-500">Email</dt>
                <dd className="text-neutral-900">{order.customer_email ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs text-neutral-500">Address</dt>
                <dd className="text-neutral-900">
                  {order.shipping_address}
                  {order.shipping_area ? `, ${order.shipping_area}` : ""},{" "}
                  {order.shipping_city}
                  {order.shipping_district ? `, ${order.shipping_district}` : ""}
                  {order.shipping_postal_code ? ` - ${order.shipping_postal_code}` : ""}
                </dd>
              </div>
              {order.customer_note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs text-neutral-500">Customer note</dt>
                  <dd className="text-neutral-900">{order.customer_note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Items</h2>
            <ul className="mt-3 divide-y divide-neutral-100">
              {(items ?? []).map((item) => (
                <li key={item.id} className="flex justify-between gap-3 py-2 text-sm">
                  <span className="text-neutral-700">
                    {item.product_name}
                    {item.variant_name ? ` · ${item.variant_name}` : ""} ×{" "}
                    {item.quantity}
                  </span>
                  <span className="text-neutral-900">
                    {formatPrice(item.line_total)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-1 border-t border-neutral-100 pt-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-neutral-500">Subtotal</dt>
                <dd>{formatPrice(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-neutral-500">Delivery</dt>
                <dd>{formatPrice(order.shipping_charge)}</dd>
              </div>
              <div className="flex justify-between font-semibold">
                <dt>Total</dt>
                <dd>{formatPrice(order.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Status history</h2>
            <ul className="mt-3 space-y-2">
              {(history ?? []).map((entry) => (
                <li key={entry.id} className="text-sm">
                  <span className="font-medium capitalize text-neutral-900">
                    {entry.status}
                  </span>
                  <span className="text-neutral-500">
                    {" "}
                    · {formatDate(entry.created_at)}
                    {entry.note ? ` · ${entry.note}` : ""}
                  </span>
                </li>
              ))}
              {(history ?? []).length === 0 && (
                <li className="text-sm text-neutral-500">No history yet.</li>
              )}
            </ul>
          </section>
        </div>

        <aside className="space-y-6">
          <form
            action={updateOrderStatus}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <input type="hidden" name="order_id" value={order.id} />
            <h2 className="text-sm font-semibold">Update status</h2>
            <Label htmlFor="status" className="mt-3">
              Status
            </Label>
            <select
              id="status"
              name="status"
              defaultValue={order.status}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Label htmlFor="note" className="mt-3">
              Note (optional)
            </Label>
            <input
              id="note"
              name="note"
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
            />
            <Button type="submit" size="sm" className="mt-3 w-full">
              Save status
            </Button>
            <p className="mt-2 text-[11px] text-neutral-500">
              Cancelling or returning an order restores its stock.
            </p>
          </form>

          <form
            action={updatePaymentStatus}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <input type="hidden" name="order_id" value={order.id} />
            <h2 className="text-sm font-semibold">Payment</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Method: {order.payment_method.toUpperCase()}
            </p>
            <Label htmlFor="payment_status" className="mt-3">
              Payment status
            </Label>
            <select
              id="payment_status"
              name="payment_status"
              defaultValue={order.payment_status}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <Button type="submit" size="sm" className="mt-3 w-full">
              Save payment
            </Button>
          </form>

          <form
            action={updateOrderNote}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <input type="hidden" name="order_id" value={order.id} />
            <h2 className="text-sm font-semibold">Internal note</h2>
            <textarea
              name="admin_note"
              rows={3}
              defaultValue={order.admin_note ?? ""}
              className="mt-3 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              placeholder="Only visible to admins"
            />
            <Button type="submit" size="sm" variant="outline" className="mt-3 w-full">
              Save note
            </Button>
          </form>

          <section className="rounded-xl border border-neutral-200 bg-white p-5">
            <h2 className="text-sm font-semibold">Courier</h2>
            {order.courier_name ? (
              <dl className="mt-3 space-y-1 text-xs">
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Courier</dt>
                  <dd className="text-neutral-900">{order.courier_name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Tracking</dt>
                  <dd className="font-mono text-neutral-900">
                    {order.courier_tracking_code ??
                      order.courier_consignment_id ??
                      "—"}
                  </dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-neutral-500">Status</dt>
                  <dd className="capitalize text-neutral-900">
                    {order.courier_status ?? "—"}
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">
                Not sent to a courier yet.
              </p>
            )}
            <form action={sendToCourier} className="mt-3">
              <input type="hidden" name="order_id" value={order.id} />
              <Button
                type="submit"
                size="sm"
                variant="outline"
                className="w-full"
                disabled={!courierEnabled || Boolean(order.courier_consignment_id)}
              >
                {!courierEnabled
                  ? "Courier not configured"
                  : order.courier_consignment_id
                    ? "Already sent"
                    : "Send to Steadfast"}
              </Button>
            </form>
            <p className="mt-2 text-[11px] text-neutral-500">
              Requires Steadfast API keys in Vercel.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
