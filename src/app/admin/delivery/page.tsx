import type { Metadata } from "next";
import { Suspense } from "react";
import { createZone, deleteZone, updateZone } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Delivery",
};

export default function AdminDeliveryPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <DeliveryContent />
    </Suspense>
  );
}

async function DeliveryContent() {
  const supabase = await createClient();
  const { data: zones } = await supabase
    .from("shipping_zones")
    .select("*")
    .order("charge");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Delivery</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Delivery charges shown at checkout. Current zones: {zones?.length ?? 0}.
      </p>

      <div className="mt-6 space-y-3">
        {(zones ?? []).map((zone) => (
          <form
            key={zone.id}
            action={updateZone}
            className="grid items-end gap-2 rounded-xl border border-neutral-200 bg-white p-4 sm:grid-cols-6"
          >
            <input type="hidden" name="id" value={zone.id} />
            <div className="sm:col-span-2">
              <Label htmlFor={`name-${zone.id}`}>Zone name</Label>
              <Input id={`name-${zone.id}`} name="name" defaultValue={zone.name} required />
            </div>
            <div>
              <Label htmlFor={`charge-${zone.id}`}>Charge (৳)</Label>
              <Input
                id={`charge-${zone.id}`}
                name="charge"
                type="number"
                min="0"
                step="0.01"
                defaultValue={zone.charge}
                required
              />
            </div>
            <div>
              <Label htmlFor={`threshold-${zone.id}`}>Free over (৳)</Label>
              <Input
                id={`threshold-${zone.id}`}
                name="free_shipping_threshold"
                type="number"
                min="0"
                step="0.01"
                defaultValue={zone.free_shipping_threshold ?? ""}
              />
            </div>
            <div>
              <Label htmlFor={`days-${zone.id}`}>Estimated days</Label>
              <Input
                id={`days-${zone.id}`}
                name="estimated_days"
                defaultValue={zone.estimated_days ?? ""}
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  name="is_active"
                  defaultChecked={zone.is_active}
                />
                Active
              </label>
              <Button type="submit" size="sm">
                Save
              </Button>
              <Button
                type="submit"
                formAction={deleteZone}
                variant="outline"
                size="sm"
              >
                Delete
              </Button>
            </div>
          </form>
        ))}
      </div>

      <form
        action={createZone}
        className="mt-6 grid items-end gap-2 rounded-xl border border-dashed border-neutral-300 bg-white p-4 sm:grid-cols-6"
      >
        <div className="sm:col-span-2">
          <Label htmlFor="new-zone-name">New zone</Label>
          <Input id="new-zone-name" name="name" placeholder="e.g. Chattogram" required />
        </div>
        <div>
          <Label htmlFor="new-zone-charge">Charge (৳)</Label>
          <Input
            id="new-zone-charge"
            name="charge"
            type="number"
            min="0"
            step="0.01"
            defaultValue={0}
            required
          />
        </div>
        <div>
          <Label htmlFor="new-zone-threshold">Free over (৳)</Label>
          <Input
            id="new-zone-threshold"
            name="free_shipping_threshold"
            type="number"
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <Label htmlFor="new-zone-days">Estimated days</Label>
          <Input id="new-zone-days" name="estimated_days" placeholder="2-4 days" />
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 text-xs">
            <input type="checkbox" name="is_active" defaultChecked />
            Active
          </label>
          <Button type="submit" size="sm" variant="outline">
            Add zone
          </Button>
        </div>
      </form>

      <p className="mt-4 text-xs text-neutral-500">
        Tip: free shipping thresholds are stored but checkout currently charges the
        zone rate. Example inside Dhaka: {formatPrice(60)}.
      </p>
    </div>
  );
}
