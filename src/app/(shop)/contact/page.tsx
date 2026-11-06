import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
        Contact
      </p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
        We would love to hear from you.
      </h1>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-neutral-600">
        Questions about a product, your order, or your skin? Send us a message
        and we will get back to you within one working day.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Email
          </p>
          <a
            href={`mailto:${siteConfig.contact.email || "hello@bachmanbeauty.com"}`}
            className="mt-2 block text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            {siteConfig.contact.email || "hello@bachmanbeauty.com"}
          </a>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Phone
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            {siteConfig.contact.phone || "Coming soon"}
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Delivery area
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            All over Bangladesh
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Response time
          </p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            Within 1 working day
          </p>
        </div>
      </div>
    </div>
  );
}
