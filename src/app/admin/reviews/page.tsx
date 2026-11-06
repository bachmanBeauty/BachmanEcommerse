import type { Metadata } from "next";
import { Suspense } from "react";
import { deleteReview, setReviewApproval } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Reviews",
};

export default function AdminReviewsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <ReviewsContent />
    </Suspense>
  );
}

async function ReviewsContent() {
  const supabase = await createClient();
  const { data: reviews } = await supabase
    .from("reviews")
    .select("id, rating, title, comment, is_approved, created_at, products(name, slug)")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Reviews</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Approve reviews before they appear on the storefront.
      </p>

      <div className="mt-6 space-y-3">
        {(reviews ?? []).map((review) => {
          const product = Array.isArray(review.products)
            ? review.products[0]
            : review.products;
          return (
            <div
              key={review.id}
              className="rounded-xl border border-neutral-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium text-neutral-900">
                    {product?.name ?? "Product"} · {review.rating}/5
                  </p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(review.created_at)}
                    {review.title ? ` · ${review.title}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form action={setReviewApproval}>
                    <input type="hidden" name="id" value={review.id} />
                    <input
                      type="hidden"
                      name="approved"
                      value={String(!review.is_approved)}
                    />
                    <Button type="submit" size="sm" variant="outline">
                      {review.is_approved ? "Unapprove" : "Approve"}
                    </Button>
                  </form>
                  <form action={deleteReview}>
                    <input type="hidden" name="id" value={review.id} />
                    <Button type="submit" size="sm" variant="outline">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
              {review.comment && (
                <p className="mt-2 text-sm text-neutral-600">{review.comment}</p>
              )}
              <p className="mt-2 text-xs">
                <span
                  className={
                    review.is_approved
                      ? "rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700"
                      : "rounded-full bg-amber-50 px-2 py-0.5 text-amber-700"
                  }
                >
                  {review.is_approved ? "Approved" : "Pending"}
                </span>
              </p>
            </div>
          );
        })}
        {(reviews ?? []).length === 0 && (
          <p className="rounded-xl border border-dashed border-neutral-300 bg-white px-4 py-8 text-center text-sm text-neutral-500">
            No reviews yet.
          </p>
        )}
      </div>
    </div>
  );
}
