import type { Metadata } from "next";
import { Suspense } from "react";
import { updateSettings } from "@/actions/admin-store";
import { AdminLoading } from "@/components/admin/loading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Settings",
};

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<AdminLoading />}>
      <SettingsContent />
    </Suspense>
  );
}

async function SettingsContent() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold tracking-tight">Website settings</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Store details used across the website and emails.
      </p>

      <form
        action={updateSettings}
        className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="store_name">Store name</Label>
            <Input
              id="store_name"
              name="store_name"
              defaultValue={settings?.store_name ?? "Bachman Beauty"}
              required
            />
          </div>
          <div>
            <Label htmlFor="store_email">Support email</Label>
            <Input
              id="store_email"
              name="store_email"
              type="email"
              defaultValue={settings?.store_email ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="store_phone">Phone</Label>
            <Input
              id="store_phone"
              name="store_phone"
              defaultValue={settings?.store_phone ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="currency">Currency</Label>
            <Input
              id="currency"
              name="currency"
              defaultValue={settings?.currency ?? "BDT"}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="store_address">Address</Label>
            <Input
              id="store_address"
              name="store_address"
              defaultValue={settings?.store_address ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="facebook_url">Facebook URL</Label>
            <Input
              id="facebook_url"
              name="facebook_url"
              defaultValue={settings?.facebook_url ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="instagram_url">Instagram URL</Label>
            <Input
              id="instagram_url"
              name="instagram_url"
              defaultValue={settings?.instagram_url ?? ""}
            />
          </div>
          <div>
            <Label htmlFor="tax_percentage">Tax (%)</Label>
            <Input
              id="tax_percentage"
              name="tax_percentage"
              type="number"
              min="0"
              step="0.01"
              defaultValue={settings?.tax_percentage ?? 0}
            />
          </div>
          <div>
            <Label htmlFor="free_shipping_threshold">
              Free shipping over (৳)
            </Label>
            <Input
              id="free_shipping_threshold"
              name="free_shipping_threshold"
              type="number"
              min="0"
              step="0.01"
              defaultValue={settings?.free_shipping_threshold ?? ""}
            />
          </div>
        </div>
        <Button type="submit" size="lg">
          Save settings
        </Button>
      </form>
    </div>
  );
}
