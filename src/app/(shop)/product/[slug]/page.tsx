import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { WishlistButton } from "@/components/shop/product-card";
import { ProductPurchase } from "@/components/shop/product-purchase";
import { getProductBySlug } from "@/lib/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) return { title: "Product not found" };

  return {
    title: product.name,
    description: product.short_description ?? undefined,
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ProductContent params={params} />
    </Suspense>
  );
}

async function ProductContent({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const image =
    product.product_images.find((item) => item.is_primary) ??
    product.product_images[0];
  const activeVariants = product.product_variants.filter(
    (variant) => variant.is_active,
  );
  const price = activeVariants[0]?.price ?? product.base_price;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <nav className="flex items-center gap-2 text-xs text-neutral-500">
        <Link href="/" className="hover:text-neutral-800">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-neutral-800">
          Shop
        </Link>
        {product.categories && (
          <>
            <span>/</span>
            <Link
              href={`/shop?category=${product.categories.slug}`}
              className="hover:text-neutral-800"
            >
              {product.categories.name}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-neutral-800">{product.name}</span>
      </nav>

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-gradient-to-br from-rose-50 via-neutral-50 to-amber-50">
            {image ? (
              <Image
                src={image.url}
                alt={image.alt ?? product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex items-center justify-center px-8 text-center font-serif text-2xl text-neutral-400">
                {product.name}
              </span>
            )}
          </div>

          {product.product_images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-3">
              {product.product_images.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50"
                >
                  <Image
                    src={item.url}
                    alt={item.alt ?? product.name}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              {product.categories && (
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-rose-600">
                  {product.categories.name}
                </p>
              )}
              <h1 className="mt-2 font-serif text-3xl tracking-tight text-neutral-900 sm:text-4xl">
                {product.name}
              </h1>
            </div>
            <WishlistButton
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={price}
              imageUrl={image?.url ?? null}
              className="rounded-full border border-neutral-200 p-3 text-neutral-500 transition-colors hover:text-rose-600"
            />
          </div>

          {product.short_description && (
            <p className="mt-4 text-sm leading-relaxed text-neutral-600">
              {product.short_description}
            </p>
          )}

          {product.skin_type && product.skin_type.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.skin_type.map((type) => (
                <span
                  key={type}
                  className="rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700"
                >
                  {type}
                </span>
              ))}
            </div>
          )}

          <ProductPurchase product={product} />

          <div className="mt-8 divide-y divide-neutral-200 border-y border-neutral-200">
            {product.description && (
              <details open className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-neutral-900">
                  Description
                </summary>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {product.description}
                </p>
              </details>
            )}
            {product.ingredients && (
              <details className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-neutral-900">
                  Key ingredients
                </summary>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {product.ingredients}
                </p>
              </details>
            )}
            {product.how_to_use && (
              <details className="group py-4">
                <summary className="cursor-pointer list-none text-sm font-medium text-neutral-900">
                  How to use
                </summary>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-600">
                  {product.how_to_use}
                </p>
              </details>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-2">
      <div className="aspect-[4/5] animate-pulse rounded-3xl bg-neutral-100" />
      <div className="space-y-4">
        <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
        <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-100" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-neutral-100" />
      </div>
    </div>
  );
}
