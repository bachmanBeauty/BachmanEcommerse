"use client";

import { useState } from "react";
import { useStore } from "@/components/store/store-provider";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/types/catalog";

export function ProductPurchase({ product }: { product: Product }) {
  const { addItem } = useStore();
  const variants = product.product_variants.filter((variant) => variant.is_active);
  const firstAvailable =
    variants.find((variant) => variant.stock_quantity > 0) ?? variants[0];

  const [variantId, setVariantId] = useState(firstAvailable?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const variant = variants.find((item) => item.id === variantId) ?? firstAvailable;
  const price = variant?.price ?? product.base_price;
  const maxStock = variant?.stock_quantity ?? 0;
  const image =
    product.product_images.find((item) => item.is_primary) ??
    product.product_images[0];

  if (!variant) {
    return (
      <p className="rounded-xl bg-neutral-100 px-4 py-3 text-sm text-neutral-600">
        This product is not available right now.
      </p>
    );
  }

  const handleAdd = () => {
    if (maxStock < 1) return;

    addItem(
      {
        productId: product.id,
        variantId: variant.id,
        name: product.name,
        variantName: variant.name,
        slug: product.slug,
        price: variant.price,
        imageUrl: image?.url ?? null,
        maxQuantity: maxStock,
      },
      quantity,
    );

    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="mt-6">
      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-semibold text-neutral-900">
          {formatPrice(price)}
        </span>
        {variant.compare_at_price && variant.compare_at_price > price && (
          <span className="text-sm text-neutral-400 line-through">
            {formatPrice(variant.compare_at_price)}
          </span>
        )}
      </div>

      {variants.length > 1 && (
        <div className="mt-5">
          <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
            Size
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {variants.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setVariantId(item.id)}
                disabled={item.stock_quantity < 1}
                className={
                  item.id === variant.id
                    ? "rounded-full border border-neutral-900 bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
                    : "rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm text-neutral-700 hover:border-neutral-400 disabled:cursor-not-allowed disabled:opacity-40"
                }
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex h-12 items-center rounded-full border border-neutral-300">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            className="px-4 text-lg text-neutral-600 hover:text-neutral-900"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium">{quantity}</span>
          <button
            type="button"
            onClick={() =>
              setQuantity((value) => Math.min(Math.max(1, maxStock), value + 1))
            }
            className="px-4 text-lg text-neutral-600 hover:text-neutral-900"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={maxStock < 1}
          className="h-12 flex-1 rounded-full bg-neutral-900 px-8 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 sm:flex-none"
        >
          {maxStock < 1
            ? "Sold out"
            : added
              ? "Added to bag"
              : "Add to bag"}
        </button>
      </div>

      <p className="mt-3 text-xs text-neutral-500">
        {maxStock > 0
          ? maxStock <= 5
            ? `Only ${maxStock} left in stock`
            : "In stock"
          : "Out of stock"}
        {" · "}Cash on delivery available
      </p>
    </div>
  );
}
