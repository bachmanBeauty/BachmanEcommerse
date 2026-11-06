import type { Metadata } from "next";
import { CartView } from "@/components/shop/cart-view";

export const metadata: Metadata = {
  title: "Shopping bag",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <h1 className="font-serif text-4xl tracking-tight text-neutral-900">
        Shopping bag
      </h1>
      <CartView />
    </div>
  );
}
