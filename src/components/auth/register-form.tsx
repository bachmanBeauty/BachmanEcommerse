"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUp, type AuthState } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { FormMessage } from "@/components/ui/form-message";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(
    signUp,
    null,
  );

  return (
    <form action={formAction} className="space-y-4">
      <FormMessage state={state} />

      <div>
        <Label htmlFor="fullName">পূর্ণ নাম</Label>
        <Input
          id="fullName"
          name="fullName"
          autoComplete="name"
          placeholder="আপনার নাম"
          required
        />
      </div>

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
        <Label htmlFor="password">পাসওয়ার্ড</Label>
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

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "অ্যাকাউন্ট তৈরি হচ্ছে…" : "অ্যাকাউন্ট তৈরি করুন"}
      </Button>

      <p className="text-center text-sm text-neutral-600">
        ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
        <Link href="/login" className="font-medium text-rose-600 hover:text-rose-700">
          সাইন ইন
        </Link>
      </p>
    </form>
  );
}
