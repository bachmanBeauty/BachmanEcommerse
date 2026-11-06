import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/actions/auth";
import { ProfileForm } from "@/components/account/profile-form";
import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button-link";
import { getCurrentRole, requireUser } from "@/lib/auth";
import { formatDate, formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My account",
};

type OrderRow = {
  order_number: string;
  status: string;
  total: number;
  created_at: string;
  payment_method: string;
};

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const user = await requireUser();
  const supabase = await createClient();
  const [profileResult, ordersResult, role] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("id", user.id)
      .maybeSingle(),
    supabase
      .from("orders")
      .select("order_number, status, total, created_at, payment_method")
      .order("created_at", { ascending: false })
      .limit(10),
    getCurrentRole(),
  ]);

  const profile = profileResult.data;
  const orders = (ordersResult.data ?? []) as OrderRow[];

  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl tracking-tight text-neutral-900">
            My account
          </h1>
          <p className="mt-1 text-sm text-neutral-600">{user.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ButtonLink href="/wishlist" variant="outline" size="sm">
            Wishlist
          </ButtonLink>
          {role === "admin" && (
            <ButtonLink href="/admin" variant="outline" size="sm">
              Admin dashboard
            </ButtonLink>
          )}
          <form action={signOut}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
          Profile
        </h2>
        <ProfileForm
          defaultName={profile?.full_name ?? ""}
          defaultPhone={profile?.phone ?? ""}
        />
      </section>

      <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
            Recent orders
          </h2>
          <Link
            href="/track"
            className="text-xs font-medium text-rose-600 hover:text-rose-700"
          >
            Track an order
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="mt-4 text-sm text-neutral-600">
            You have not placed an order yet.{" "}
            <Link href="/shop" className="text-rose-600 hover:text-rose-700">
              Browse the shop
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-neutral-100">
            {orders.map((order) => (
              <li
                key={order.order_number}
                className="flex flex-wrap items-center justify-between gap-3 py-3"
              >
                <div>
                  <p className="font-mono text-sm font-medium text-neutral-900">
                    {order.order_number}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {formatDate(order.created_at)} · {order.payment_method.toUpperCase()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium capitalize text-neutral-700">
                    {order.status}
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14">
      <div className="h-10 w-48 animate-pulse rounded bg-neutral-100" />
      <div className="mt-8 h-40 animate-pulse rounded-2xl bg-neutral-100" />
    </div>
  );
}
