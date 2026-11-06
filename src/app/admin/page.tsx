import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin dashboard",
};

export default function AdminPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Products, orders and customers will be managed from here.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Products", description: "Catalog and stock", phase: "Phase 05" },
          { label: "Orders", description: "Fulfilment and status", phase: "Phase 05" },
          { label: "Customers", description: "Accounts and history", phase: "Phase 05" },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-neutral-200 bg-white p-5"
          >
            <p className="text-sm font-medium text-neutral-900">{item.label}</p>
            <p className="mt-1 text-sm text-neutral-500">{item.description}</p>
            <p className="mt-4 text-xs font-medium uppercase tracking-wide text-neutral-400">
              {item.phase}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
