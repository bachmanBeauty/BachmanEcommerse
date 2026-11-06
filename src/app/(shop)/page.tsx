import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";

const categories = [
  {
    name: "Cleanser",
    note: "Start fresh",
    href: "/shop?category=cleanser",
    gradient: "from-rose-100 via-rose-50 to-white",
  },
  {
    name: "Toner",
    note: "Balance",
    href: "/shop?category=toner",
    gradient: "from-amber-100 via-amber-50 to-white",
  },
  {
    name: "Serum",
    note: "Target concerns",
    href: "/shop?category=serum",
    gradient: "from-emerald-100 via-emerald-50 to-white",
  },
  {
    name: "Moisturizer",
    note: "Lock in hydration",
    href: "/shop?category=moisturizer",
    gradient: "from-sky-100 via-sky-50 to-white",
  },
  {
    name: "Sunscreen",
    note: "Everyday protection",
    href: "/shop?category=sunscreen",
    gradient: "from-orange-100 via-orange-50 to-white",
  },
  {
    name: "Face Mask",
    note: "Weekly treat",
    href: "/shop?category=face-mask",
    gradient: "from-violet-100 via-violet-50 to-white",
  },
];

const collections = [
  {
    name: "Hydration",
    description: "Lightweight layers for thirsty skin.",
    gradient: "from-sky-200 via-sky-100 to-white",
  },
  {
    name: "Glow",
    description: "Brightening essentials for dull days.",
    gradient: "from-rose-200 via-rose-100 to-white",
  },
  {
    name: "Protection",
    description: "Daily defense against sun and pollution.",
    gradient: "from-amber-200 via-amber-100 to-white",
  },
];

const benefits = [
  {
    title: "Authentic products",
    description: "Sourced directly, never re-packed or diluted.",
  },
  {
    title: "Cash on delivery",
    description: "Pay when your order reaches your door.",
  },
  {
    title: "Nationwide delivery",
    description: "Inside Dhaka in 1–2 days, outside in 2–4 days.",
  },
  {
    title: "Real support",
    description: "Talk to us before you buy — we reply personally.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="overflow-hidden bg-gradient-to-b from-rose-50/70 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:py-24 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
              Skincare, simplified
            </p>
            <h1 className="mt-4 font-serif text-4xl leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              Healthy skin starts with a gentle routine.
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-neutral-600">
              Thoughtfully formulated skincare made for Bangladeshi skin and
              weather. Honest ingredients, no noise, visible results.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/shop" size="lg">
                Shop the collection
              </ButtonLink>
              <ButtonLink href="/about" size="lg" variant="outline">
                Our story
              </ButtonLink>
            </div>
            <p className="mt-6 text-xs text-neutral-500">
              Cash on delivery · Nationwide shipping · Authentic products
            </p>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-gradient-to-br from-rose-200 via-rose-100 to-amber-50 shadow-xl shadow-rose-100/60">
              <div className="absolute -left-10 top-16 h-40 w-40 rounded-full bg-white/40 blur-2xl" />
              <div className="absolute -right-8 bottom-20 h-52 w-52 rounded-full bg-rose-300/30 blur-3xl" />
              <div className="absolute inset-x-8 bottom-8 rounded-2xl bg-white/70 p-5 backdrop-blur">
                <p className="font-serif text-lg text-neutral-900">
                  The Bachman Beauty edit
                </p>
                <p className="mt-1 text-sm text-neutral-600">
                  Cleanser · Serum · Moisturizer · SPF
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 py-8 sm:grid-cols-3">
          {[
            "Dermatologist-informed formulas",
            "Cash on delivery available",
            "Delivery all over Bangladesh",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 justify-center">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50 text-rose-600">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-3.5 w-3.5"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
                </svg>
              </span>
              <p className="text-sm text-neutral-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              Shop by category
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Build a routine that fits your skin, step by step.
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden text-sm font-medium text-rose-600 hover:text-rose-700 sm:block"
          >
            View all →
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className={`group flex aspect-square flex-col justify-between rounded-2xl bg-gradient-to-br ${category.gradient} p-4 ring-1 ring-neutral-200/60 transition-shadow hover:shadow-md`}
            >
              <span className="text-[11px] uppercase tracking-wide text-neutral-500">
                {category.note}
              </span>
              <span className="font-medium text-neutral-900 group-hover:text-rose-700">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-neutral-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center">
            <h2 className="font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              The first collection
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-sm text-neutral-600">
              Three focused edits, launching soon. Join us at the start of
              something good.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {collections.map((collection) => (
              <div
                key={collection.name}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <div
                  className={`flex aspect-[4/3] items-center justify-center bg-gradient-to-br ${collection.gradient}`}
                >
                  <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700">
                    Launching soon
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-neutral-900">{collection.name}</h3>
                  <p className="mt-1 text-sm text-neutral-600">
                    {collection.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <ButtonLink href="/shop" variant="outline">
              Browse the shop
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <h2 className="font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
          Why buy from us
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-neutral-200 p-5"
            >
              <h3 className="text-sm font-semibold text-neutral-900">
                {benefit.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl bg-rose-600 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="font-serif text-3xl tracking-tight text-white sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-rose-50">
            Tell us about your skin and we will help you build a simple routine
            — no pressure, no guesswork.
          </p>
          <div className="mt-7">
            <ButtonLink
              href="/contact"
              size="lg"
              className="bg-white text-rose-700 hover:bg-rose-50"
            >
              Talk to us
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
