import type { Metadata } from "next";
import { WishlistView } from "@/components/shop/wishlist-view";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default function WishlistPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl tracking-tight text-neutral-900">
        Wishlist
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Products you have saved for later.
      </p>
      <WishlistView />
    </div>
  );
}
