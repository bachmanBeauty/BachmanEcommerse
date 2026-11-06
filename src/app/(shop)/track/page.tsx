import type { Metadata } from "next";
import { TrackForm } from "@/components/shop/track-form";

export const metadata: Metadata = {
  title: "Track order",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
        Order tracking
      </p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight text-neutral-900">
        Where is my order?
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        Enter your order number and the phone number you used at checkout.
      </p>
      <TrackForm />
    </div>
  );
}
