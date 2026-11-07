import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

const categories = [
  {
    name: "Cleanser",
    note: "A fresh start",
    href: "/shop?category=cleanser",
    gradient: "from-rose-200 via-rose-100 to-[#fbf3ec]",
  },
  {
    name: "Toner",
    note: "Balance",
    href: "/shop?category=toner",
    gradient: "from-amber-200 via-amber-100 to-[#fbf5ea]",
  },
  {
    name: "Serum",
    note: "Target concerns",
    href: "/shop?category=serum",
    gradient: "from-emerald-200 via-emerald-100 to-[#f3f8f1]",
  },
  {
    name: "Moisturizer",
    note: "Lock in hydration",
    href: "/shop?category=moisturizer",
    gradient: "from-sky-200 via-sky-100 to-[#f1f6f9]",
  },
  {
    name: "Sunscreen",
    note: "Everyday protection",
    href: "/shop?category=sunscreen",
    gradient: "from-orange-200 via-orange-100 to-[#fbf4ec]",
  },
  {
    name: "Face Mask",
    note: "Weekly treat",
    href: "/shop?category=face-mask",
    gradient: "from-violet-200 via-violet-100 to-[#f6f3fa]",
  },
];

const benefits = [
  {
    title: "Authentic products",
    description: "Sourced directly, never re-packed or diluted.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 5.25 5.25v6c0 4.14 2.86 7.4 6.75 9.75 3.89-2.35 6.75-5.61 6.75-9.75v-6L12 3Zm-2.25 8.75 1.75 1.75 3.25-3.5"
      />
    ),
  },
  {
    title: "Cash on delivery",
    description: "Pay only when your order reaches your door.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 7.5h16.5v9.75a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V7.5Zm0 0V6A2.25 2.25 0 0 1 6 3.75h9M16.5 12.75h.01"
      />
    ),
  },
  {
    title: "Nationwide delivery",
    description: "Inside Dhaka in 1–2 days, outside in 2–4 days.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h9v9h-9v-9Zm9 3h3l3 3v3h-6v-6Zm-6 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      />
    ),
  },
  {
    title: "Real support",
    description: "Talk to us before you buy — we reply personally.",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20.25 8.25v5.25a2.25 2.25 0 0 1-2.25 2.25H9l-4.5 3.75V6.75A2.25 2.25 0 0 1 6.75 4.5h11.25a2.25 2.25 0 0 1 2.25 2.25Z"
      />
    ),
  },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-rose-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-amber-200/30 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-700">
              <span className="h-px w-8 bg-rose-400" />
              Skincare, simplified
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Healthy skin starts with a gentle routine.
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
              Thoughtfully formulated skincare made for Bangladeshi skin and
              weather. Honest ingredients, no noise, visible results.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href="/shop"
                size="lg"
                className="rounded-full bg-neutral-900 px-8 hover:bg-neutral-800"
              >
                Shop the collection
              </ButtonLink>
              <ButtonLink
                href="/about"
                size="lg"
                variant="outline"
                className="rounded-full border-neutral-300 bg-transparent px-8"
              >
                Our story
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
              {["Authentic products", "Cash on delivery", "Nationwide shipping"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3.5 w-3.5 text-rose-600"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                    {item}
                  </span>
                ),
              )}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-200 via-[#f4e3d7] to-amber-100 shadow-2xl shadow-rose-200/50">
              <div className="absolute -right-12 top-8 h-52 w-52 rounded-full border border-white/50" />
              <div className="absolute -right-6 top-16 h-52 w-52 rounded-full border border-white/40" />
              <div className="absolute left-7 top-7 rounded-full bg-white/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-700 backdrop-blur">
                New collection
              </div>

              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/75 p-5 backdrop-blur-md">
                <p className="font-serif text-xl text-neutral-900">
                  The daily ritual
                </p>
                <ol className="mt-3 space-y-2">
                  {["Cleanse", "Treat", "Moisturise", "Protect"].map(
                    (step, index) => (
                      <li
                        key={step}
                        className="flex items-center gap-3 text-sm text-neutral-700"
                      >
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-semibold text-white">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ),
                  )}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/50">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-7 text-xs text-neutral-600 sm:grid-cols-4 sm:text-sm">
          {[
            "Dermatologist-informed",
            "Cruelty-free formulas",
            "Cash on delivery",
            "Delivery all over Bangladesh",
          ].map((item) => (
            <p key={item} className="flex items-center justify-center gap-2 text-center">
              <span className="h-1 w-1 rounded-full bg-rose-500" />
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
                The edit
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
                Bestsellers
              </h2>
              <p className="mt-2 max-w-md text-sm text-neutral-600">
                The essentials our customers reach for again and again.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
            >
              Shop all products
            </Link>
          </div>

          <Suspense fallback={<FeaturedSkeleton />}>
            <FeaturedGrid />
          </Suspense>
        </div>
      </section>

      <section className="border-y border-neutral-200/70 bg-white/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              Categories
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              Build your routine
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Start with the steps that matter. Add slowly, keep it simple.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.href}
                className={`group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl bg-gradient-to-br ${category.gradient} p-4 ring-1 ring-neutral-200/50 transition-transform duration-300 hover:-translate-y-1`}
              >
                <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-white/60 text-neutral-700 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-3.5 w-3.5"
                    aria-hidden="true"
                  >
                    <path d="M7 17 17 7m0 0H9m8 0v8" />
                  </svg>
                </span>
                <span className="text-[10px] uppercase tracking-[0.14em] text-neutral-500">
                  {category.note}
                </span>
                <span className="mt-1 font-serif text-lg text-neutral-900">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 lg:grid-cols-2">
          <div className="relative order-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#e8d3c5] via-[#f1e3d8] to-[#f8f1e9] p-10 lg:order-1">
            <div className="flex aspect-[5/4] flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                Est. 2026 · Dhaka
              </span>
              <div>
                <p className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">
                  Made for real routines.
                </p>
                <p className="mt-3 max-w-xs text-sm text-neutral-600">
                  A small collection, chosen carefully for humid summers, dusty
                  winters and everyday life.
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/60" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 rounded-full border border-white/50" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              Our story
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              Fewer products. Better choices.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              We started Bachman Beauty because skincare felt loud and
              complicated. Too many steps, too many claims, very little made for
              our skin and our weather.
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-600">
              So we are building a focused collection — cleansers, serums,
              moisturizers and sunscreens — authentic, clearly explained and easy
              to keep up with.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "Authentic, directly sourced products",
                "Clear ingredients and honest claims",
                "Simple routines you can actually follow",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-neutral-700">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-3 w-3"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-7">
              <ButtonLink href="/about" variant="outline" className="rounded-full">
                Read our story
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200/70 bg-white/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              Why Bachman Beauty
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              Shopping made simple
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-neutral-200/80 bg-[#fbf8f4] p-6 transition-shadow hover:shadow-md hover:shadow-neutral-200/60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-neutral-800 ring-1 ring-neutral-200">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    {benefit.icon}
                  </svg>
                </span>
                <h3 className="mt-4 text-sm font-semibold text-neutral-900">
                  {benefit.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="relative overflow-hidden rounded-[2rem] bg-neutral-950 px-6 py-14 text-center sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -left-20 top-0 h-64 w-64 rounded-full bg-rose-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl" />
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-rose-300">
            Need a hand?
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl">
            Not sure where to start? We will build a routine with you.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            Tell us about your skin and we will suggest a simple, honest routine.
            No pressure, no guesswork.
          </p>
          <div className="mt-8">
            <ButtonLink
              href="/contact"
              size="lg"
              className="rounded-full bg-white px-8 text-neutral-900 hover:bg-neutral-100"
            >
              Talk to us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}

async function FeaturedGrid() {
  const products = await getProducts({ sort: "newest" });
  const featured = products.filter((product) => product.is_featured);
  const list = (featured.length > 0 ? featured : products).slice(0, 4);

  if (list.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-14 text-center">
        <p className="font-serif text-xl text-neutral-900">
          The first collection is on its way
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
          Products are being prepared. Check back soon or get in touch.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/contact">Contact us</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {list.map((product: Product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] animate-pulse rounded-2xl bg-white"
        />
      ))}
    </div>
  );
}
