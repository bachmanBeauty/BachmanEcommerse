import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Shop",
};

const categories = [
  "Cleanser",
  "Toner",
  "Serum",
  "Moisturizer",
  "Sunscreen",
  "Face Mask",
];

export default function ShopPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-20">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          Shop
        </p>
        <h1 className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
          Our first collection is on the way.
        </h1>
        <p className="mt-4 text-base leading-relaxed text-neutral-600">
          Products are being photographed and prepared. In the meantime, explore
          the categories we will carry, or get in touch if you are looking for
          something specific.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-2">
        {categories.map((category) => (
          <span
            key={category}
            className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700"
          >
            {category}
          </span>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/contact">Ask about a product</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
