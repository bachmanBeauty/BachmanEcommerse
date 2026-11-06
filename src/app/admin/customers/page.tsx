import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { AdminLoading } from "@/components/admin/loading";
import { formatDate } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <CustomersContent />
    </Suspense>
  );
}

async function CustomersContent() {
  const supabase = await createClient();
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("*").order("created_at", { ascending: false }),
    supabase.from("user_roles").select("user_id, role"),
  ]);

  const roleMap = new Map((roles ?? []).map((row) => [row.user_id, row.role]));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-neutral-600">
            {profiles?.length ?? 0} registered accounts
          </p>
        </div>
        <Link href="/admin/roles" className="text-xs text-rose-600 hover:text-rose-700">
          Manage roles →
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(profiles ?? []).map((profile) => (
              <tr key={profile.id}>
                <td className="px-4 py-3 text-neutral-900">
                  {profile.full_name || "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {profile.email || "—"}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {profile.phone || "—"}
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs capitalize text-neutral-700">
                    {roleMap.get(profile.id) ?? "customer"}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {formatDate(profile.created_at)}
                </td>
              </tr>
            ))}
            {(profiles ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-500">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-500">
        Email shows after the profile email migration is applied.
      </p>
    </div>
  );
}
