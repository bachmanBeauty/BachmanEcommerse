import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Our story",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
        Our story
      </p>
      <h1 className="mt-4 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
        Skincare made for real routines.
      </h1>

      <div className="mt-8 space-y-5 text-base leading-relaxed text-neutral-700">
        <p>
          Bachman Beauty started with a simple frustration: too many products,
          too much noise, and very little that felt made for our skin and our
          weather.
        </p>
        <p>
          We are building a small, focused collection — cleansers, serums,
          moisturizers and sunscreens — chosen for humid summers, dusty winters
          and everyday life in Bangladesh. Every product will be authentic,
          clearly explained, and easy to fit into a routine you can keep.
        </p>
        <p>
          No miracle claims. Just honest formulas, careful choices and a team you
          can actually talk to.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <ButtonLink href="/shop">Explore the shop</ButtonLink>
        <ButtonLink href="/contact" variant="outline">
          Contact us
        </ButtonLink>
      </div>
    </div>
  );
}
