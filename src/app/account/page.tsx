import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "My account",
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
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My account</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Manage your details and orders.
          </p>
        </div>
        <form action={signOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>

      <dl className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
        <div className="flex justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-neutral-500">Name</dt>
          <dd className="text-sm font-medium text-neutral-900">
            {profile?.full_name || "Not set"}
          </dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-neutral-500">Email</dt>
          <dd className="text-sm font-medium text-neutral-900">{user.email}</dd>
        </div>
        <div className="flex justify-between gap-4 px-5 py-4">
          <dt className="text-sm text-neutral-500">Phone</dt>
          <dd className="text-sm font-medium text-neutral-900">
            {profile?.phone || "Not set"}
          </dd>
        </div>
      </dl>

      <p className="mt-6 text-sm text-neutral-600">
        Orders and saved addresses will appear here in the next phase.{" "}
        <Link href="/" className="font-medium text-rose-600 hover:text-rose-700">
          Back to store
        </Link>
      </p>
    </div>
  );
}

function AccountSkeleton() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="text-sm text-neutral-500">Loading your account…</p>
    </div>
  );
}
