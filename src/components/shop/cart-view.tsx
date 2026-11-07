"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { cart, subtotal, hydrated, setQuantity, removeItem, clearCart } =
    useStore();

  if (!hydrated) {
    return (
      <div className="mt-10 space-y-3">
        {Array.from({ length: 2 }).map((_, index) => (
          <div
            key={index}
            className="h-28 animate-pulse rounded-2xl bg-neutral-100"
          />
        ))}
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
          কয়েকটা এসেনশিয়াল যোগ করুন — সেগুলো এখানে দেখা যাবে।
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">শপ দেখুন</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <div className="divide-y divide-neutral-200 rounded-2xl border border-neutral-200 bg-white">
          {cart.map((item) => (
            <div key={item.key} className="flex gap-4 p-4">
              <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-rose-50 to-amber-50">
                {item.imageUrl ? (
                  <Image
                    src={item.imageUrl}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center p-2 text-center text-[10px] text-neutral-400">
                    {item.name}
                  </span>
                )}
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/product/${item.slug}`}
                      className="block truncate text-sm font-medium text-neutral-900 hover:text-rose-600"
                    >
                      {item.name}
                    </Link>
                    {item.variantName && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {item.variantName}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.key)}
                    className="text-xs text-neutral-500 hover:text-rose-600"
                  >
                    সরান
                  </button>
                </div>

                <div className="flex items-end justify-between gap-3">
                  <div className="flex h-9 items-center rounded-full border border-neutral-300">
                    <button
                      type="button"
                      onClick={() => setQuantity(item.key, item.quantity - 1)}
                      className="px-3 text-neutral-600 hover:text-neutral-900"
                      aria-label={`${item.name} এর পরিমাণ কমান`}
                    >
                      −
                    </button>
                    <span className="w-6 text-center text-sm">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(item.key, item.quantity + 1)}
                      className="px-3 text-neutral-600 hover:text-neutral-900"
                      aria-label={`${item.name} এর পরিমাণ বাড়ান`}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-sm font-medium text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between">
          <Link
            href="/shop"
            className="text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            ← কেনাকাটা চালিয়ে যান
          </Link>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-neutral-500 hover:text-rose-600"
          >
            ব্যাগ খালি করুন
          </button>
        </div>
      </div>

      <aside className="h-fit rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          অর্ডার সারাংশ
        </h2>
        <dl className="mt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-600">সাবটোটাল</dt>
            <dd className="font-medium text-neutral-900">
              {formatPrice(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-neutral-600">ডেলিভারি</dt>
            <dd className="text-neutral-500">চেকআউটে হিসাব হবে</dd>
          </div>
        </dl>
        <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 text-base font-semibold text-neutral-900">
          <span>মোট</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <ButtonLink href="/checkout" className="mt-6 w-full" size="lg">
          চেকআউট করুন
        </ButtonLink>
        <p className="mt-3 text-center text-[11px] text-neutral-500">
          ক্যাশ অন ডেলিভারি আছে
        </p>
      </aside>
    </div>
  );
}
