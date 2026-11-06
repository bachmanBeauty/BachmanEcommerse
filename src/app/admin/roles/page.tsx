import type { Metadata } from "next";
import { Suspense } from "react";
import { setUserRole } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Roles",
};

export default function AdminRolesPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <RolesContent />
    </Suspense>
  );
}

async function RolesContent() {
  const admin = await requireAdmin();
  const supabase = await createClient();
  const [{ data: profiles }, { data: roles }] = await Promise.all([
    supabase.from("profiles").select("id, full_name, email").order("created_at"),
    supabase.from("user_roles").select("user_id, role"),
  ]);

  const roleMap = new Map((roles ?? []).map((row) => [row.user_id, row.role]));

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Admin roles &amp; permissions
      </h1>
      <p className="mt-1 text-sm text-neutral-600">
        Admins can manage products, orders and settings. Customers can only shop.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-neutral-100 text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {(profiles ?? []).map((profile) => {
              const isSelf = profile.id === admin.id;
              const role = roleMap.get(profile.id) ?? "customer";
              return (
                <tr key={profile.id}>
                  <td className="px-4 py-3">
                    <span className="block text-neutral-900">
                      {profile.full_name || "—"}
                      {isSelf && (
                        <span className="ml-2 rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-500">
                          you
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {profile.email || profile.id.slice(0, 8)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <form action={setUserRole} className="flex items-center gap-2">
                      <input type="hidden" name="user_id" value={profile.id} />
                      <select
                        name="role"
                        defaultValue={role}
                        disabled={isSelf}
                        className="h-9 rounded-md border border-neutral-300 px-2 text-xs capitalize"
                        aria-label={`Role for ${profile.full_name ?? profile.id}`}
                      >
                        <option value="customer">customer</option>
                        <option value="admin">admin</option>
                      </select>
                      {!isSelf && (
                        <Button type="submit" size="sm" variant="outline">
                          Save
                        </Button>
                      )}
                    </form>
                  </td>
                  <td className="px-4 py-3 text-xs text-neutral-500">
                    {isSelf ? "Your own role is locked." : ""}
                  </td>
                </tr>
              );
            })}
            {(profiles ?? []).length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-10 text-center text-neutral-500">
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
