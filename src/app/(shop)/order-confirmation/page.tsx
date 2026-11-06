import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ClearCartOnMount } from "@/components/store/clear-cart-on-mount";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "Order confirmed",
};

type ConfirmationProps = {
  searchParams: Promise<{ number?: string; payment?: string }>;
};

export default function OrderConfirmationPage({
  searchParams,
}: ConfirmationProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:py-20">
      <Suspense fallback={<ConfirmationSkeleton />}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function Confirmation({ searchParams }: ConfirmationProps) {
  const { number, payment } = await searchParams;
  const failed = payment === "failed" || payment === "cancelled";
  const cookieStore = await cookies();
  const raw = cookieStore.get("bb_last_order")?.value;

  let summary: { number?: string; total?: number; itemCount?: number } | null =
    null;
  if (raw) {
    try {
      summary = JSON.parse(raw);
    } catch {
      summary = null;
    }
  }

  const matches = summary?.number === number;

  return (
    <>
      <ClearCartOnMount />

      <div className="text-center">
        {failed ? (
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-2xl font-semibold text-amber-600">
            !
          </span>
        ) : (
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-7 w-7"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
            </svg>
          </span>
        )}
        <h1 className="mt-5 font-serif text-4xl tracking-tight text-neutral-900">
          {failed ? "Payment not completed" : "Thank you for your order"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {failed
            ? "Your order is saved but still marked unpaid. Contact us to complete the payment or request cash on delivery."
            : "We have received your order and will call you shortly to confirm the delivery details."}
        </p>
      </div>

      {number && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">Order number</p>
            <p className="font-mono text-sm font-semibold text-neutral-900">
              {number}
            </p>
          </div>
          {matches && summary && (
            <>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-neutral-100 pt-3">
                <p className="text-sm text-neutral-500">Items</p>
                <p className="text-sm text-neutral-900">{summary.itemCount}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-neutral-100 pt-3">
                <p className="text-sm text-neutral-500">Total</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {formatPrice(summary.total ?? 0)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/track">Track this order</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          Continue shopping
        </ButtonLink>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        Keep your order number safe. You can track it anytime with your phone
        number. Need help?{" "}
        <Link href="/contact" className="text-rose-600 hover:text-rose-700">
          Contact us
        </Link>
      </p>
    </>
  );
}

function ConfirmationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="mx-auto h-14 w-14 animate-pulse rounded-full bg-neutral-100" />
      <div className="mx-auto h-8 w-2/3 animate-pulse rounded bg-neutral-100" />
      <div className="h-40 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}
