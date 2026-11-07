import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { ButtonLink } from "@/components/ui/button-link";
import { getProducts } from "@/lib/catalog";
import type { Product } from "@/types/catalog";

const categories = [
  {
    name: "ক্লিনজার",
    note: "ফ্রেশ শুরু",
    href: "/shop?category=cleanser",
    gradient: "from-rose-200 via-rose-100 to-[#fff3e6]",
  },
  {
    name: "টোনার",
    note: "ব্যালান্স",
    href: "/shop?category=toner",
    gradient: "from-amber-200 via-amber-100 to-[#fff6e8]",
  },
  {
    name: "সিরাম",
    note: "লক্ষ্য ঠিক করুন",
    href: "/shop?category=serum",
    gradient: "from-emerald-200 via-emerald-100 to-[#f5f8f0]",
  },
  {
    name: "ময়েশ্চারাইজার",
    note: "হাইড্রেশন ধরে রাখুন",
    href: "/shop?category=moisturizer",
    gradient: "from-sky-200 via-sky-100 to-[#f2f6f8]",
  },
  {
    name: "সানস্ক্রিন",
    note: "প্রতিদিনের সুরক্ষা",
    href: "/shop?category=sunscreen",
    gradient: "from-orange-200 via-orange-100 to-[#fff4e9]",
  },
  {
    name: "ফেস মাস্ক",
    note: "সাপ্তাহিক যত্ন",
    href: "/shop?category=face-mask",
    gradient: "from-violet-200 via-violet-100 to-[#f8f3f6]",
  },
];

const benefits = [
  {
    title: "আসল প্রোডাক্ট",
    description: "সরাসরি সোর্স করা, কখনো রি-প্যাক বা ভেজাল নয়।",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3 5.25 5.25v6c0 4.14 2.86 7.4 6.75 9.75 3.89-2.35 6.75-5.61 6.75-9.75v-6L12 3Zm-2.25 8.75 1.75 1.75 3.25-3.5"
      />
    ),
  },
  {
    title: "ক্যাশ অন ডেলিভারি",
    description: "প্রোডাক্ট হাতে পেয়ে টাকা দিন।",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 7.5h16.5v9.75a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V7.5Zm0 0V6A2.25 2.25 0 0 1 6 3.75h9M16.5 12.75h.01"
      />
    ),
  },
  {
    title: "সারা দেশে ডেলিভারি",
    description: "ঢাকায় ১–২ দিন, ঢাকার বাইরে ২–৪ দিন।",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h9v9h-9v-9Zm9 3h3l3 3v3h-6v-6Zm-6 7.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"
      />
    ),
  },
  {
    title: "সত্যিকারের সাপোর্ট",
    description: "কেনার আগেই কথা বলুন — আমরা নিজেরাই উত্তর দিই।",
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
        <div className="pointer-events-none absolute -left-40 -top-40 h-96 w-96 rounded-full bg-rose-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -right-32 top-40 h-96 w-96 rounded-full bg-amber-200/40 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <p className="font-script text-3xl text-rose-700">স্বাগতম</p>
            <p className="mt-1 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500">
              <span className="h-px w-8 bg-rose-400" />
              ত্বকের যত্ন, সহজ করে
            </p>
            <h1 className="mt-5 font-serif text-4xl leading-[1.15] tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl">
              সুস্থ ত্বকের শুরু এক কোমল রুটিনে।
            </h1>
            <p className="mt-6 max-w-md text-base leading-relaxed text-neutral-600">
              বাংলাদেশের আবহাওয়া ও ত্বকের কথা ভেবে তৈরি স্কিনকেয়ার। সৎ উপাদান,
              বাড়তি কথা নেই, দৃশ্যমান ফলাফল।
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink
                href="/shop"
                size="lg"
                className="rounded-full bg-neutral-900 px-8 hover:bg-neutral-800"
              >
                কালেকশন দেখুন
              </ButtonLink>
              <ButtonLink
                href="/about"
                size="lg"
                variant="outline"
                className="rounded-full border-neutral-300 bg-transparent px-8"
              >
                আমাদের গল্প
              </ButtonLink>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-500">
              {["আসল প্রোডাক্ট", "ক্যাশ অন ডেলিভারি", "সারা দেশে ডেলিভারি"].map(
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-rose-200 via-[#f6e7d8] to-amber-100 shadow-2xl shadow-rose-200/50">
              <div className="absolute -right-12 top-8 h-52 w-52 rounded-full border border-white/50" />
              <div className="absolute -right-6 top-16 h-52 w-52 rounded-full border border-white/40" />
              <div className="absolute left-7 top-7 rounded-full bg-white/60 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-700 backdrop-blur">
                নতুন কালেকশন
              </div>

              <div className="absolute inset-x-6 bottom-6 rounded-2xl bg-white/75 p-5 backdrop-blur-md">
                <p className="font-serif text-xl text-neutral-900">
                  প্রতিদিনের রুটিন
                </p>
                <ol className="mt-3 space-y-2">
                  {["ক্লিনজ", "ট্রিট", "ময়েশ্চারাইজ", "সানস্ক্রিন"].map(
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
            "ডার্মাটোলজিস্ট-পরামর্শিত",
            "ক্রুয়েলটি-ফ্রি ফর্মুলা",
            "ক্যাশ অন ডেলিভারি",
            "সারা বাংলাদেশে ডেলিভারি",
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
                নির্বাচিত
              </p>
              <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
                বেস্টসেলার
              </h2>
              <p className="mt-2 max-w-md text-sm text-neutral-600">
                যে প্রোডাক্টগুলো কাস্টমাররা বারবার বেছে নেন।
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900"
            >
              সব প্রোডাক্ট দেখুন
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
              ক্যাটাগরি
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              নিজের রুটিন গড়ুন
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              যেসব ধাপ আসলে দরকার, সেখান থেকেই শুরু করুন। ধীরে ধীরে যোগ করুন,
              সহজ রাখুন।
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
          <div className="relative order-2 overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#f3d8c3] via-[#f9e8d9] to-[#fff5ea] p-10 lg:order-1">
            <div className="flex aspect-[5/4] flex-col justify-between">
              <span className="text-[10px] uppercase tracking-[0.24em] text-neutral-500">
                প্রতিষ্ঠা ২০২৬ · ঢাকা
              </span>
              <div>
                <p className="font-serif text-4xl leading-tight text-neutral-900 sm:text-5xl">
                  আসল রুটিনের জন্য তৈরি।
                </p>
                <p className="mt-3 max-w-xs text-sm text-neutral-600">
                  ছোট একটা কালেকশন, যত্ন করে বাছাই করা — আর্দ্র গ্রীষ্ম, ধুলোভরা
                  শীত আর প্রতিদিনের জীবনের জন্য।
                </p>
              </div>
            </div>
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full border border-white/60" />
            <div className="pointer-events-none absolute -right-8 -top-8 h-56 w-56 rounded-full border border-white/50" />
          </div>

          <div className="order-1 lg:order-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              আমাদের গল্প
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              কম প্রোডাক্ট, ভালো সিদ্ধান্ত।
            </h2>
            <p className="mt-4 text-base leading-relaxed text-neutral-600">
              স্কিনকেয়ারকে ঘিরে অনেক হৈচৈ আর জটিলতা দেখে বাচম্যান বিউটির শুরু।
              অনেক ধাপ, অনেক দাবি — কিন্তু আমাদের ত্বক আর আবহাওয়ার জন্য খুব কম।
            </p>
            <p className="mt-3 text-base leading-relaxed text-neutral-600">
              তাই আমরা একটা ফোকাসড কালেকশন গড়ছি — ক্লিনজার, সিরাম, ময়েশ্চারাইজার
              আর সানস্ক্রিন। আসল প্রোডাক্ট, স্পষ্ট ব্যাখ্যা, আর সহজে মানা যায় এমন
              রুটিন।
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "সরাসরি সোর্স করা আসল প্রোডাক্ট",
                "স্পষ্ট উপাদান আর সৎ দাবি",
                "সহজে অনুসরণযোগ্য রুটিন",
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
                গল্পটি পড়ুন
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-neutral-200/70 bg-white/40 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-rose-700">
              কেন বাচম্যান বিউটি
            </p>
            <h2 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
              কেনাকাটা সহজ
            </h2>
          </div>

          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-neutral-200/80 bg-white p-6 transition-shadow hover:shadow-md hover:shadow-neutral-200/60"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fff7ee] text-neutral-800 ring-1 ring-neutral-200">
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
            সাহায্য দরকার?
          </p>
          <h2 className="mx-auto mt-3 max-w-xl font-serif text-3xl leading-tight tracking-tight text-white sm:text-4xl">
            শুরু কোথায় করবেন বুঝতে পারছেন না? আমরা একসাথে রুটিন বানাব।
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-neutral-400">
            আপনার ত্বক নিয়ে বলুন, আমরা সহজ ও সৎ একটা রুটিন সাজিয়ে দেব। কোনো
            চাপ নেই, কোনো অনুমান নেই।
          </p>
          <div className="mt-8">
            <ButtonLink
              href="/contact"
              size="lg"
              className="rounded-full bg-white px-8 text-neutral-900 hover:bg-neutral-100"
            >
              কথা বলুন
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
          প্রথম কালেকশন আসছে
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
          প্রোডাক্ট প্রস্তুত হচ্ছে। শীঘ্রই আবার দেখুন বা আমাদের সাথে যোগাযোগ
          করুন।
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/contact">যোগাযোগ করুন</ButtonLink>
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
