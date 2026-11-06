import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button-link";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
        Your cart is empty
      </h1>
      <p className="mt-3 text-sm text-neutral-600">
        Products are launching soon. Once they are live, your cart will appear
        here.
      </p>
      <div className="mt-8 flex justify-center gap-3">
        <ButtonLink href="/shop">Browse the shop</ButtonLink>
        <ButtonLink href="/" variant="outline">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
