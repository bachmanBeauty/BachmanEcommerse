"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { siteConfig } from "@/config/site";
import { safeNextPath } from "@/lib/redirects";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; success?: string } | null;

const emailSchema = z
  .string()
  .trim()
  .min(1, "ইমেইল দিন।")
  .email("সঠিক ইমেইল দিন।");

const passwordSchema = z
  .string()
  .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");

function firstIssue(error: z.ZodError) {
  return error.issues[0]?.message ?? "ফর্মটি আবার দেখুন।";
}

function authError(message: string) {
  if (message.includes("Invalid login credentials")) {
    return "ইমেইল বা পাসওয়ার্ড ভুল।";
  }
  if (message.includes("Email not confirmed")) {
    return "ইমেইল এখনো নিশ্চিত হয়নি। ইমেইলের লিংকে ক্লিক করুন।";
  }
  if (message.includes("already registered")) {
    return "এই ইমেইলে আগেই অ্যাকাউন্ট আছে।";
  }
  if (message.includes("Password should be")) {
    return "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।";
  }
  if (message.includes("rate limit")) {
    return "অনেকবার চেষ্টা হয়েছে। কিছুক্ষণ পর আবার চেষ্টা করুন।";
  }
  return "কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।";
}

export async function signIn(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      email: emailSchema,
      password: z.string().min(1, "পাসওয়ার্ড দিন।"),
    })
    .safeParse({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: authError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect(safeNextPath(formData.get("next")));
}

export async function signUp(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "পূর্ণ নাম লিখুন।"),
      email: emailSchema,
      password: passwordSchema,
    })
    .safeParse({
      fullName: String(formData.get("fullName") ?? ""),
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
    });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.fullName },
      emailRedirectTo: `${siteConfig.url}/auth/callback?next=/account`,
    },
  });

  if (error) {
    return { error: authError(error.message) };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/account");
  }

  return {
    success:
      "অ্যাকাউন্ট তৈরি হয়েছে। ইমেইলের নিশ্চিতকরণ লিংকে ক্লিক করুন, তারপর সাইন ইন করুন।",
  };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function requestPasswordReset(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z.object({ email: emailSchema }).safeParse({
    email: String(formData.get("email") ?? ""),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${siteConfig.url}/auth/callback?next=/reset-password`,
  });

  return {
    success:
      "এই ইমেইলে অ্যাকাউন্ট থাকলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।",
  };
}

export async function updatePassword(
  _previousState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const parsed = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string().min(1, "পাসওয়ার্ড নিশ্চিত করুন।"),
    })
    .refine((values) => values.password === values.confirmPassword, {
      message: "পাসওয়ার্ড মিলছে না।",
      path: ["confirmPassword"],
    })
    .safeParse({
      password: String(formData.get("password") ?? ""),
      confirmPassword: String(formData.get("confirmPassword") ?? ""),
    });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error) };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    return { error: authError(error.message) };
  }

  revalidatePath("/", "layout");
  redirect("/account");
}
