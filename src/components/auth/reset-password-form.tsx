"use client";

import { useActionState } from "react";
import { updatePassword, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    updatePassword,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />

      <div>
        <Label htmlFor="password">নতুন পাসওয়ার্ড</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="কমপক্ষে ৮ অক্ষর"
          minLength={8}
          required
        />
      </div>

      <div>
        <Label htmlFor="confirmPassword">নতুন পাসওয়ার্ড নিশ্চিত করুন</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="আবার লিখুন"
          minLength={8}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "আপডেট হচ্ছে…" : "পাসওয়ার্ড আপডেট করুন"}
      </Button>
    </form>
  );
}
