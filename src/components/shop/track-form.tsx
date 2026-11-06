"use client";

import { useActionState } from "react";
import { trackOrder, type TrackState } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatDate, formatPrice } from "@/lib/format";

const steps = [
  { key: "pending", label: "Order placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "processing", label: "Preparing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
] as const;

export function TrackForm() {
  const [state, formAction, pending] = useActionState<TrackState, FormData>(
    trackOrder,
    null,
  );

  return (
    <div className="mt-8">
      <form
        action={formAction}
        className="grid gap-4 rounded-2xl border border-neutral-200 bg-white p-6 sm:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <Label htmlFor="orderNumber">Order number</Label>
          <Input
            id="orderNumber"
            name="orderNumber"
            placeholder="BB-261105-01001"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            required
          />
        </div>
        <div className="flex items-end">
          <Button type="submit" disabled={pending} className="h-10 w-full">
            {pending ? "Checking…" : "Track order"}
          </Button>
        </div>
        <div className="sm:col-span-3">
          <FormMessage state={state} />
        </div>
      </form>

      {state?.order && <OrderDetails order={state.order} />}
    </div>
  );
}

function OrderDetails({ order }: { order: NonNullable<TrackState>["order"] }) {
  if (!order) return null;

  const cancelled = order.status === "cancelled" || order.status === "returned";
  const currentIndex = steps.findIndex((step) => step.key === order.status);

  return (
    <div className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-sm font-semibold text-neutral-900">
            {order.order_number}
          </p>
          <p className="mt-1 text-xs text-neutral-500">
            Placed on {formatDate(order.created_at)} · {order.customer_name}
          </p>
        </div>
        <span
          className={
            cancelled
              ? "rounded-full bg-red-50 px-3 py-1 text-xs font-medium capitalize text-red-700"
              : "rounded-full bg-rose-50 px-3 py-1 text-xs font-medium capitalize text-rose-700"
          }
        >
          {order.status}
        </span>
      </div>

      {cancelled ? (
        <p className="mt-4 rounded-xl bg-neutral-50 px-4 py-3 text-sm text-neutral-600">
          This order is {order.status}. If you need help, please contact us.
        </p>
      ) : (
        <ol className="mt-6 grid gap-4 sm:grid-cols-5">
          {steps.map((step, index) => {
            const done = currentIndex >= index;
            return (
              <li key={step.key} className="flex items-center gap-3 sm:block">
                <span
                  className={
                    done
                      ? "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-600 text-xs font-semibold text-white"
                      : "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-neutral-300 text-xs text-neutral-400"
                  }
                >
                  {index + 1}
                </span>
                <span
                  className={
                    done
                      ? "mt-2 block text-xs font-medium text-neutral-900"
                      : "mt-2 block text-xs text-neutral-500"
                  }
                >
                  {step.label}
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <ul className="mt-6 divide-y divide-neutral-100 border-t border-neutral-100 pt-2">
        {order.items.map((item, index) => (
          <li
            key={`${item.name}-${index}`}
            className="flex justify-between gap-3 py-2 text-sm"
          >
            <span className="text-neutral-700">
              {item.name}
              {item.variant ? ` · ${item.variant}` : ""} × {item.quantity}
            </span>
            <span className="text-neutral-900">
              {formatPrice(item.line_total)}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-500">Subtotal</span>
          <span className="text-neutral-900">{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-neutral-500">Delivery</span>
          <span className="text-neutral-900">
            {formatPrice(order.shipping_charge)}
          </span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  );
}
