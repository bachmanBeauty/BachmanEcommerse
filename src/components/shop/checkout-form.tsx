"use client";

import { useActionState, useState } from "react";
import { placeOrder, type CheckoutState } from "@/actions/orders";
import { useStore } from "@/components/store/store-provider";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ButtonLink } from "@/components/ui/button-link";
import type { ShippingZone } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

type CheckoutFormProps = {
  zones: ShippingZone[];
  defaults: { fullName: string; email: string; phone: string };
  sslcommerzEnabled: boolean;
};

export function CheckoutForm({
  zones,
  defaults,
  sslcommerzEnabled,
}: CheckoutFormProps) {
  const { cart, subtotal, hydrated } = useStore();
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(
    placeOrder,
    null,
  );
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");

  const selectedZone = zones.find((zone) => zone.id === zoneId);
  const shipping = selectedZone?.charge ?? 0;
  const total = subtotal + shipping;
  const itemsPayload = JSON.stringify(
    cart
      .filter((item) => item.variantId)
      .map((item) => ({
        variant_id: item.variantId,
        quantity: item.quantity,
      })),
  );

  if (!hydrated) {
    return (
      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div className="h-96 animate-pulse rounded-2xl bg-neutral-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-neutral-900">
          Your bag is empty
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
          Add something to your bag before checking out.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">Browse the shop</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]"
    >
      <input type="hidden" name="items" value={itemsPayload} />

      <div className="space-y-8">
        <FormMessage state={state} />

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Contact
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">Full name</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={defaults.fullName}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">Phone</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                defaultValue={defaults.phone}
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="customerEmail">Email (optional)</Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
                defaultValue={defaults.email}
                autoComplete="email"
                placeholder="you@example.com"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Delivery address
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="shippingAddress">Address</Label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                autoComplete="street-address"
                placeholder="House, road, block"
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingArea">Area</Label>
              <Input
                id="shippingArea"
                name="shippingArea"
                autoComplete="address-level3"
                placeholder="e.g. Dhanmondi"
              />
            </div>
            <div>
              <Label htmlFor="shippingCity">City</Label>
              <Input
                id="shippingCity"
                name="shippingCity"
                defaultValue="Dhaka"
                autoComplete="address-level2"
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingDistrict">District</Label>
              <Input
                id="shippingDistrict"
                name="shippingDistrict"
                autoComplete="address-level1"
                placeholder="e.g. Dhaka"
              />
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">Postal code</Label>
              <Input
                id="shippingPostalCode"
                name="shippingPostalCode"
                autoComplete="postal-code"
                placeholder="1209"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingZoneId">Delivery area</Label>
              <select
                id="shippingZoneId"
                name="shippingZoneId"
                value={zoneId}
                onChange={(event) => setZoneId(event.target.value)}
                className="h-10 w-full rounded-md border border-neutral-300 bg-white px-3 text-sm focus-visible:border-rose-500 focus-visible:outline-none"
                required
              >
                {zones.map((zone) => (
                  <option key={zone.id} value={zone.id}>
                    {zone.name} — {formatPrice(zone.charge)}
                    {zone.estimated_days ? ` (${zone.estimated_days})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Payment
          </h2>
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-neutral-300 p-4">
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              defaultChecked
              className="mt-1 h-4 w-4 accent-neutral-900"
            />
            <span>
              <span className="block text-sm font-medium text-neutral-900">
                Cash on delivery
              </span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                Pay in cash when your order arrives.
              </span>
            </span>
          </label>

          {sslcommerzEnabled ? (
            <label className="mt-3 flex items-start gap-3 rounded-xl border border-neutral-300 p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="sslcommerz"
                className="mt-1 h-4 w-4 accent-neutral-900"
              />
              <span>
                <span className="block text-sm font-medium text-neutral-900">
                  Pay online — bKash, Nagad or card
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500">
                  Secure payment via SSLCommerz.
                </span>
              </span>
            </label>
          ) : (
            <p className="mt-3 text-xs text-neutral-500">
              Online payment is coming soon.
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <Label htmlFor="note">Order note (optional)</Label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="Anything we should know about your delivery?"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:border-rose-500 focus-visible:outline-none"
          />
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Order summary
        </h2>

        <ul className="mt-4 divide-y divide-neutral-100">
          {cart.map((item) => (
            <li key={item.key} className="flex justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block truncate font-medium text-neutral-900">
                  {item.name}
                </span>
                <span className="text-xs text-neutral-500">
                  {item.variantName ? `${item.variantName} · ` : ""}
                  Qty {item.quantity}
                </span>
              </span>
              <span className="shrink-0 text-neutral-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <dl className="mt-4 space-y-2 border-t border-neutral-200 pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-600">Subtotal</dt>
            <dd className="text-neutral-900">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">Delivery</dt>
            <dd className="text-neutral-900">{formatPrice(shipping)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          type="submit"
          disabled={pending || zones.length === 0}
          className="mt-6 h-12 w-full rounded-full bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-300"
        >
          {pending ? "Placing order…" : "Place order"}
        </button>
        <p className="mt-3 text-center text-[11px] text-neutral-500">
          By placing this order you agree to our delivery and returns policy.
        </p>
      </aside>
    </form>
  );
}
