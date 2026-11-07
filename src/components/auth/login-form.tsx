"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";
import { signIn, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signIn,
    null,
  );
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />
      <FormMessage state={state} />

      <div>
        <Label htmlFor="email">ইমেইল</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">পাসওয়ার্ড</Label>
          <Link
            href="/forgot-password"
            className="mb-1.5 text-xs font-medium text-rose-600 hover:text-rose-700"
          >
            পাসওয়ার্ড ভুলে গেছেন?
          </Link>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "সাইন ইন হচ্ছে…" : "সাইন ইন"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        নতুন?{" "}
        <Link href="/register" className="font-medium text-rose-600 hover:text-rose-700">
          অ্যাকাউন্ট খুলুন
        </Link>
      </p>
    </form>
  );
}
