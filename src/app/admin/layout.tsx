import { Suspense, type ReactNode } from "react";
import { signOut } from "@/actions/auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<AdminFallback />}>
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}

async function AdminGuard({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();

  return (
    <AdminShell
      email={admin.email ?? ""}
      signOutAction={signOut}
    >
      {children}
    </AdminShell>
  );
}

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100">
      <p className="text-sm text-neutral-500">Checking access…</p>
    </div>
  );
}
