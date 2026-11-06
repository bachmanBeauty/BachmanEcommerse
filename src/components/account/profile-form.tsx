"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileForm({
  defaultName,
  defaultPhone,
}: {
  defaultName: string;
  defaultPhone: string;
}) {
  const [state, formAction, pending] = useActionState<ProfileState, FormData>(
    updateProfile,
    null,
  );

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <FormMessage state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="fullName">Full name</Label>
          <Input
            id="fullName"
            name="fullName"
            defaultValue={defaultName}
            autoComplete="name"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={defaultPhone}
            autoComplete="tel"
            placeholder="01XXXXXXXXX"
          />
        </div>
      </div>
      <Button type="submit" disabled={pending} size="sm">
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
