import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { deleteCoupon, updateCoupon } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Edit coupon",
};

type CouponPageProps = {
  params: Promise<{ id: string }>;
};

const localDateTime = (value: string | null) =>
  value ? new Date(value).toISOString().slice(0, 16) : "";

export default function EditCouponPage({ params }: CouponPageProps) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <EditCouponContent params={params} />
    </Suspense>
  );
}

async function EditCouponContent({ params }: CouponPageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: coupon } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!coupon) notFound();

  return (
    <div className="max-w-2xl">
      <Link href="/admin/coupons" className="text-xs text-neutral-500 hover:text-neutral-800">
        ← Back to coupons
      </Link>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Edit {coupon.code}
      </h1>

      <form action={updateCoupon} className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
        <input type="hidden" name="id" value={coupon.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="code">Code</Label>
            <Input id="code" name="code" defaultValue={coupon.code} required />
          </div>
          <div>
            <Label htmlFor="discount_type">Type</Label>
            <select
              id="discount_type"
              name="discount_type"
              defaultValue={coupon.discount_type}
              className="h-10 w-full rounded-md border border-neutral-300 px-3 text-sm"
            >
              <option value="percentage">Percentage</option>
              <option value="fixed">Fixed (৳)</option>
            </select>
          </div>
          <div>
            <Label htmlFor="discount_value">Value</Label>
            <Input
              id="discount_value"
              name="discount_value"
              type="number"
              min="0"
              step="0.01"
              defaultValue={coupon.discount_value}
              required
            />
          </div>
          <div>
            <Label htmlFor="min_order_amount">Min order (৳)</Label>
            <Input
              id="min_order_amount"
              name="min_order_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={coupon.min_order_amount}
            />
          </div>
          <div>
            <Label htmlFor="max_discount_amount">Max discount (৳)</Label>
            <Input
              id="max_discount_amount"
              name="max_discount_amount"
              type="number"
              min="0"
              step="0.01"
              defaultValue={coupon.max_discount_amount ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="usage_limit">Usage limit</Label>
            <Input
              id="usage_limit"
              name="usage_limit"
              type="number"
              min="0"
              defaultValue={coupon.usage_limit ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="starts_at">Starts at</Label>
            <Input
              id="starts_at"
              name="starts_at"
              type="datetime-local"
              defaultValue={localDateTime(coupon.starts_at)}
            />
          </div>
          <div>
            <Label htmlFor="ends_at">Ends at</Label>
            <Input
              id="ends_at"
              name="ends_at"
              type="datetime-local"
              defaultValue={localDateTime(coupon.ends_at)}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" name="description" defaultValue={coupon.description ?? ""} />
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={coupon.is_active} />
          Active
        </label>
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Save coupon</Button>
          <Button type="submit" formAction={deleteCoupon} variant="outline">
            Delete
          </Button>
        </div>
      </form>
    </div>
  );
}
