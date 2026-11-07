import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "যোগাযোগ",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
        যোগাযোগ
      </p>
      <h1 className="mt-2 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
        আপনার কথা শুনতে চাই।
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
        প্রোডাক্ট, অর্ডার বা আপনার ত্বক নিয়ে প্রশ্ন আছে? আমাদের লিখুন — এক
        কর্মদিবসের মধ্যে উত্তর দেব।
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            ইমেইল
          </p>
          <a
            href={`mailto:${siteConfig.contact.email || "hello@bachmanbeauty.com"}`}
            className="mt-2 block text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            {siteConfig.contact.email || "hello@bachmanbeauty.com"}
          </a>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            ফোন
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            {siteConfig.contact.phone || "শীঘ্রই আসছে"}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            ডেলিভারি এলাকা
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            সারা বাংলাদেশ
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            উত্তর দেওয়ার সময়
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            ১ কর্মদিবসের মধ্যে
          </p>
        </div>
      </div>
    </div>
  );
}
