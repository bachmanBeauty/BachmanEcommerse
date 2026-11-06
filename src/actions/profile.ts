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
    return { error: "Please sign in again." };
  }

  const parsed = z
    .object({
      fullName: z.string().trim().min(2, "Please enter your name."),
      phone: z
        .string()
        .trim()
        .min(6, "Please enter a valid phone number.")
        .optional()
        .or(z.literal("")),
    })
    .safeParse({
      fullName: String(formData.get("fullName") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
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
    return { error: error.message };
  }

  revalidatePath("/account");
  return { success: "Profile updated." };
}
