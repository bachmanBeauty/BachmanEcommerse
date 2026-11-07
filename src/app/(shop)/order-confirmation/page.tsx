import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { Suspense } from "react";
import { ClearCartOnMount } from "@/components/store/clear-cart-on-mount";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = {
  title: "অর্ডার নিশ্চিত",
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
          {failed ? "পেমেন্ট সম্পন্ন হয়নি" : "অর্ডারের জন্য ধন্যবাদ"}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          {failed
            ? "আপনার অর্ডার সেভ হয়েছে, তবে পেমেন্ট এখনো বাকি। পেমেন্ট সম্পন্ন করতে বা ক্যাশ অন ডেলিভারি নিতে আমাদের সাথে যোগাযোগ করুন।"
            : "আমরা আপনার অর্ডার পেয়েছি। ডেলিভারির বিস্তারিত নিশ্চিত করতে শীঘ্রই ফোন করব।"}
        </p>
      </div>

      {number && (
        <div className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">অর্ডার নম্বর</p>
            <p className="font-mono text-sm font-semibold text-neutral-900">
              {number}
            </p>
          </div>
          {matches && summary && (
            <>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-neutral-100 pt-3">
                <p className="text-sm text-neutral-500">আইটেম</p>
                <p className="text-sm text-neutral-900">{summary.itemCount}</p>
              </div>
              <div className="mt-3 flex items-center justify-between gap-4 border-t border-neutral-100 pt-3">
                <p className="text-sm text-neutral-500">মোট</p>
                <p className="text-sm font-semibold text-neutral-900">
                  {formatPrice(summary.total ?? 0)}
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <ButtonLink href="/track">অর্ডার ট্র্যাক করুন</ButtonLink>
        <ButtonLink href="/shop" variant="outline">
          কেনাকাটা চালিয়ে যান
        </ButtonLink>
      </div>

      <p className="mt-6 text-center text-xs text-neutral-500">
        অর্ডার নম্বরটি সংরক্ষণ করুন। ফোন নম্বর দিয়ে যেকোনো সময় ট্র্যাক করতে
        পারবেন। সাহায্য দরকার?{" "}
        <Link href="/contact" className="text-rose-600 hover:text-rose-700">
          যোগাযোগ করুন
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
