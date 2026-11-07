import type { Metadata } from "next";
import { TrackForm } from "@/components/shop/track-form";

export const metadata: Metadata = {
  title: "অর্ডার ট্র্যাক",
};

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:py-16">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
        অর্ডার ট্র্যাকিং
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-neutral-900">
        আমার অর্ডার কোথায়?
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        অর্ডার নম্বর ও চেকআউটে দেওয়া ফোন নম্বর দিন।
      </p>
      <TrackForm />
    </div>
  );
}
