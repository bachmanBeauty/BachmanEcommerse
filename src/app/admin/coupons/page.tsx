import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createCoupon, toggleCoupon } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Coupons",
};

export default function AdminCouponsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <CouponsContent />
    </Suspense>
  );
}

async function CouponsContent() {
  const supabase = await createClient();
  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Coupons</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Discount codes for your customers.
      </p>

      <form
        action={createCoupon}
        className="mt-6 grid items-end gap-2 rounded-xl border border-dashed border-neutral-300 bg-white p-4 sm:grid-cols-6"
      >
        <div>
          <Label htmlFor="code">Code</Label>
          <Input id="code" name="code" placeholder="WELCOME10" required />
        </div>
        <div>
          <Label htmlFor="discount_type">Type</Label>
          <select
            id="discount_type"
            name="discount_type"
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
            required
          />
        </div>
        <div>
          <Label htmlFor="min_order_amount">Min order</Label>
          <Input
            id="min_order_amount"
            name="min_order_amount"
            type="number"
            min="0"
            step="0.01"
            defaultValue={0}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input id="description" name="description" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <Button type="submit" size="sm" variant="outline">
            Add
          </Button>
        </div>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Code</th>
              <th className="px-4 py-3">Discount</th>
              <th className="px-4 py-3">Min order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(coupons ?? []).map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-4 py-3 font-mono text-xs text-neutral-900">
                  {coupon.code}
                </td>
                <td className="px-4 py-3 text-neutral-700">
                  {coupon.discount_type === "percentage"
                    ? `${coupon.discount_value}%`
                    : formatPrice(coupon.discount_value)}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {formatPrice(coupon.min_order_amount)}
                </td>
                <td className="px-4 py-3">
                  <form action={toggleCoupon}>
                    <input type="hidden" name="id" value={coupon.id} />
                    <input
                      type="hidden"
                      name="is_active"
                      value={String(coupon.is_active)}
                    />
                    <button
                      type="submit"
                      className={
                        coupon.is_active
                          ? "rounded-full bg-emerald-50 px-2 py-0.5 text-xs text-emerald-700"
                          : "rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600"
                      }
                    >
                      {coupon.is_active ? "Active" : "Inactive"}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/coupons/${coupon.id}`}
                    className="text-xs font-medium text-rose-600 hover:text-rose-700"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {(coupons ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                  No coupons yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
