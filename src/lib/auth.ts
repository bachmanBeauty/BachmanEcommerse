import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentRole() {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .maybeSingle();

  return (data?.role as "customer" | "admin" | undefined) ?? null;
}

export async function requireUser(nextPath?: string) {
  const user = await getCurrentUser();

  if (!user) {
    const target = nextPath ? `?next=${encodeURIComponent(nextPath)}` : "";
    redirect(`/login${target}`);
  }

  return user;
}

export async function requireAdmin() {
  const user = await requireUser("/admin");
  const role = await getCurrentRole();

  if (role !== "admin") {
    redirect("/");
  }

  return user;
}
