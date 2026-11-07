"use client";

import Image from "next/image";
import Link from "next/link";
import { useStore } from "@/components/store/store-provider";
import { ButtonLink } from "@/components/ui/button-link";
import { formatPrice } from "@/lib/format";

export function WishlistView() {
  const { wishlist, toggleWishlist, hydrated } = useStore();

  if (!hydrated) {
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

  if (wishlist.length === 0) {
    return (
      <div className="mt-10 rounded-2xl border border-dashed border-neutral-300 bg-white px-6 py-16 text-center">
        <h2 className="font-serif text-2xl text-neutral-900">
          এখনো কিছু সেভ করা হয়নি
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-600">
          যেকোনো প্রোডাক্টে হার্ট চাপুন — পরে কেনার জন্য এখানে থাকবে।
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/shop">শপ দেখুন</ButtonLink>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {wishlist.map((item) => (
        <div
          key={item.productId}
          className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-rose-50 via-neutral-50 to-amber-50">
            <Link href={`/product/${item.slug}`} aria-label={item.name}>
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className="object-cover"
                />
              ) : (
                <span className="absolute inset-0 flex items-center justify-center px-4 text-center font-serif text-lg text-neutral-400">
                  {item.name}
                </span>
              )}
            </Link>
            <button
              type="button"
              onClick={() => toggleWishlist(item)}
              aria-label={`${item.name} উইশলিস্ট থেকে সরান`}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-rose-600 shadow-sm backdrop-blur"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path d="M21 8.25c0 4.5-7.5 9.75-9 10.5-1.5-.75-9-6-9-10.5A4.5 4.5 0 0 1 12 5.4a4.5 4.5 0 0 1 9 2.85Z" />
              </svg>
            </button>
          </div>
          <div className="p-4">
            <Link
              href={`/product/${item.slug}`}
              className="block text-sm font-medium text-neutral-900 hover:text-rose-600"
            >
              {item.name}
            </Link>
            <p className="mt-1 text-sm font-semibold text-neutral-900">
              {formatPrice(item.price)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
