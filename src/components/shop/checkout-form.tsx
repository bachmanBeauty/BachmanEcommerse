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
      <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-neutral-900">
          আপনার ব্যাগ খালি
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
          চেকআউটের আগে ব্যাগে কিছু যোগ করুন।
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">শপ দেখুন</ButtonLink>
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
            যোগাযোগ
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="customerName">পূর্ণ নাম</Label>
              <Input
                id="customerName"
                name="customerName"
                defaultValue={defaults.fullName}
                autoComplete="name"
                required
              />
            </div>
            <div>
              <Label htmlFor="customerPhone">ফোন</Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                defaultValue={defaults.phone}
                autoComplete="tel"
                placeholder="০১XXXXXXXXX"
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="customerEmail">ইমেইল (ঐচ্ছিক)</Label>
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
            ডেলিভারি ঠিকানা
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="shippingAddress">ঠিকানা</Label>
              <Input
                id="shippingAddress"
                name="shippingAddress"
                autoComplete="street-address"
                placeholder="বাসা, রোড, ব্লক"
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingArea">এলাকা</Label>
              <Input
                id="shippingArea"
                name="shippingArea"
                autoComplete="address-level3"
                placeholder="যেমন: ধানমন্ডি"
              />
            </div>
            <div>
              <Label htmlFor="shippingCity">শহর</Label>
              <Input
                id="shippingCity"
                name="shippingCity"
                defaultValue="ঢাকা"
                autoComplete="address-level2"
                required
              />
            </div>
            <div>
              <Label htmlFor="shippingDistrict">জেলা</Label>
              <Input
                id="shippingDistrict"
                name="shippingDistrict"
                autoComplete="address-level1"
                placeholder="যেমন: ঢাকা"
              />
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">পোস্ট কোড</Label>
              <Input
                id="shippingPostalCode"
                name="shippingPostalCode"
                autoComplete="postal-code"
                placeholder="১২০৯"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingZoneId">ডেলিভারি এলাকা</Label>
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
            পেমেন্ট
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
                ক্যাশ অন ডেলিভারি
              </span>
              <span className="mt-0.5 block text-xs text-neutral-500">
                প্রোডাক্ট হাতে পেয়ে টাকা দিন।
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
                  অনলাইনে পেমেন্ট — বিকাশ, নগদ বা কার্ড
                </span>
                <span className="mt-0.5 block text-xs text-neutral-500">
                  SSLCommerz দিয়ে নিরাপদ পেমেন্ট।
                </span>
              </span>
            </label>
          ) : (
            <p className="mt-3 text-xs text-neutral-500">
              অনলাইন পেমেন্ট শীঘ্রই আসছে।
            </p>
          )}
        </section>

        <section className="rounded-2xl border border-neutral-200 bg-white p-6">
          <Label htmlFor="note">অর্ডার নোট (ঐচ্ছিক)</Label>
          <textarea
            id="note"
            name="note"
            rows={3}
            placeholder="ডেলিভারি নিয়ে কিছু জানাতে চান?"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm focus-visible:border-rose-500 focus-visible:outline-none"
          />
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          অর্ডার সারাংশ
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
                  পরিমাণ {item.quantity}
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
            <dt className="text-neutral-600">সাবটোটাল</dt>
            <dd className="text-neutral-900">{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">ডেলিভারি</dt>
            <dd className="text-neutral-900">{formatPrice(shipping)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
          <span>মোট</span>
          <span>{formatPrice(total)}</span>
        </div>

        <button
          type="submit"
          disabled={pending || zones.length === 0}
          className="mt-6 h-12 w-full rounded-full bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:bg-neutral-300"
        >
          {pending ? "অর্ডার হচ্ছে…" : "অর্ডার করুন"}
        </button>
        <p className="mt-3 text-center text-[11px] text-neutral-500">
          অর্ডার দেওয়ার মাধ্যমে আপনি ডেলিভারি ও রিটার্ন নীতিতে সম্মত হচ্ছেন।
        </p>
      </aside>
    </form>
  );
}
