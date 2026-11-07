"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

export type ProfileState = { error?: string; success?: string } | null;

export async function updateProfile(
  _previousState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getCurrentUser();

  if (!user) {
    return { error: "আবার সাইন ইন করুন।" };
  }

  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "আপনার নাম লিখুন।"),
      phone: z
        .string()
        .trim()
        .min(6, "সঠিক ফোন নম্বর দিন।")
        .optional()
        .or(z.literal("")),
    })
    .safeParse({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ফর্মটি আবার দেখুন।" };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.fullName,
      phone: parsed.data.phone || null,
    })
    .eq("id", user.id);

  if (error) {
    return { error: "প্রোফাইল সংরক্ষণ করা যায়নি। আবার চেষ্টা করুন।" };
  }

  revalidatePath("/account");
  return { success: "প্রোফাইল আপডেট হয়েছে।" };
}
