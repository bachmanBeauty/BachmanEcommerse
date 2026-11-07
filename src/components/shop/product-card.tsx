"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import { categoryLabel } from "@/lib/category-labels";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function WishlistButton({
  productId,
  name,
  slug,
  price,
  imageUrl,
  className,
}: {
  productId: string;
  name: string;
  slug: string;
  price: number;
  imageUrl: string | null;
  className?: string;
}) {
  const { toggleWishlist, isWishlisted, hydrated } = useStore();
  const active = hydrated && isWishlisted(productId);

  return (
    <button
      type="button"
      aria-label={active ? "উইশলিস্ট থেকে সরান" : "উইশলিস্টে যোগ করুন"}
      aria-pressed={active}
      onClick={() => toggleWishlist({ productId, name, slug, price, imageUrl })}
      className={className}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        className="h-5 w-5"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0 4.5-7.5 9.75-9 10.5-1.5-.75-9-6-9-10.5A4.5 4.5 0 0 1 12 5.4a4.5 4.5 0 0 1 9 2.85Z"
        />
      </svg>
    </button>
  );
}

export function ProductCard({ product }: { product: Product }) {
  const image =
    product.product_images.find((item) => item.is_primary) ??
    product.product_images[0];
  const activeVariants = product.product_variants.filter((v) => v.is_active);
  const variant = activeVariants.find((v) => v.stock_quantity > 0) ?? activeVariants[0];
  const price = variant?.price ?? product.base_price;
  const inStock = activeVariants.some((v) => v.stock_quantity > 0);

  return (
    <div className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-rose-50 via-neutral-50 to-amber-50">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {image ? (
            <Image
              src={image.url}
              alt={image.alt ?? product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-serif text-lg text-neutral-400">
              {product.name}
            </span>
          )}
        </Link>

        <WishlistButton
          productId={product.id}
          name={product.name}
          slug={product.slug}
          price={price}
          imageUrl={image?.url ?? null}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-neutral-600 shadow-sm backdrop-blur transition-colors hover:text-rose-600"
        />

        {!inStock && (
          <span className="absolute left-3 top-3 rounded-full bg-neutral-900/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
            স্টক শেষ
          </span>
        )}
      </div>

      <div className="p-4">
        {product.categories && (
          <p className="text-[11px] uppercase tracking-wide text-neutral-400">
            {categoryLabel(product.categories.slug, product.categories.name)}
          </p>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="mt-1 block text-sm font-medium text-neutral-900 hover:text-rose-600"
        >
          {product.name}
        </Link>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-neutral-900">
            {formatPrice(price)}
          </span>
          {product.compare_at_price && product.compare_at_price > price && (
            <span className="text-xs text-neutral-400 line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
