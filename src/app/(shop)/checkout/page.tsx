import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/shop/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { getShippingZones } from "@/lib/catalog";
import { isSslcommerzEnabled } from "@/lib/payments/sslcommerz";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Checkout",
};

export default function CheckoutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl tracking-tight text-neutral-900">
        Checkout
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Cash on delivery available all over Bangladesh.
      </p>
      <Suspense fallback={<CheckoutSkeleton />}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}

async function CheckoutContent() {
  // Access request-time data first so the catalog fetch never runs during
  // prerendering (it needs Supabase env vars that only exist at runtime).
  const user = await getCurrentUser();
  const zones = await getShippingZones();

  let fullName = "";
  let phone = "";
  const email = user?.email ?? "";

  if (user) {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle();

    fullName = profile?.full_name ?? "";
    phone = profile?.phone ?? "";
  }

  return (
    <CheckoutForm
      zones={zones}
      defaults={{ fullName, email, phone }}
      sslcommerzEnabled={isSslcommerzEnabled()}
    />
  );
}

function CheckoutSkeleton() {
  return (
    <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
      <div className="h-96 animate-pulse rounded-2xl bg-neutral-100" />
      <div className="h-64 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}
