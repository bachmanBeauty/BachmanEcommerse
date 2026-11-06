import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { getCategories, getProducts } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop",
};

type ShopSearchParams = {
  q?: string;
  category?: string;
  sort?: string;
};

export default function ShopPage({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <div className="max-w-2xl">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">
          Shop
        </p>
        <h1 className="mt-3 font-serif text-4xl tracking-tight text-neutral-900 sm:text-5xl">
          Skincare for every routine
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600">
          Gentle, effective essentials. Cash on delivery available all over
          Bangladesh.
        </p>
      </div>

      <Suspense fallback={<ShopSkeleton />}>
        <ShopContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ShopContent({
  searchParams,
}: {
  searchParams: Promise<ShopSearchParams>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const category = params.category ?? "";
  const sort =
    params.sort === "price-asc" || params.sort === "price-desc"
      ? params.sort
      : "newest";

  const [categories, products] = await Promise.all([
    getCategories(),
    getProducts({ query, category, sort }),
  ]);

  return (
    <>
      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/shop"
          className={
            category === ""
              ? "rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white"
              : "rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-300"
          }
        >
          All
        </Link>
        {categories.map((item) => (
          <Link
            key={item.id}
            href={`/shop?category=${item.slug}${query ? `&q=${encodeURIComponent(query)}` : ""}`}
            className={
              category === item.slug
                ? "rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white"
                : "rounded-full border border-neutral-200 bg-white px-4 py-2 text-xs font-medium text-neutral-700 hover:border-neutral-300"
            }
          >
            {item.name}
          </Link>
        ))}
      </div>

      <form
        action="/shop"
        method="get"
        className="mt-6 grid gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/60 p-4 sm:grid-cols-[1fr_auto_auto_auto]"
      >
        <input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products"
          className="h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm focus-visible:border-rose-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-200"
        />
        <select
          name="category"
          defaultValue={category}
          className="h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm focus-visible:border-rose-500 focus-visible:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.slug}>
              {item.name}
            </option>
          ))}
        </select>
        <select
          name="sort"
          defaultValue={sort}
          className="h-10 rounded-full border border-neutral-300 bg-white px-4 text-sm focus-visible:border-rose-500 focus-visible:outline-none"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
        <button
          type="submit"
          className="h-10 rounded-full bg-neutral-900 px-6 text-sm font-medium text-white hover:bg-neutral-800"
        >
          Apply
        </button>
      </form>

      <p className="mt-6 text-xs text-neutral-500">
        {products.length} {products.length === 1 ? "product" : "products"}
        {query ? ` for “${query}”` : ""}
      </p>

      {products.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-6 py-16 text-center">
          <p className="font-serif text-xl text-neutral-900">
            No products found
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
            Try a different search or category. Our first collection is being
            added right now.
          </p>
          <Link
            href="/shop"
            className="mt-5 inline-block text-sm font-medium text-rose-600 hover:text-rose-700"
          >
            Clear filters
          </Link>
        </div>
      )}
    </>
  );
}

function ShopSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="aspect-[4/5] animate-pulse rounded-2xl bg-neutral-100"
        />
      ))}
    </div>
  );
}
