import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "অ্যাকাউন্ট খুলুন",
};

export default function RegisterPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">অ্যাকাউন্ট তৈরি করুন</h1>
      <p className="mt-1 mb-6 text-sm text-neutral-600">
        দ্রুত চেকআউট ও অর্ডার ট্র্যাকিংয়ের জন্য আপনার তথ্য সেভ করুন।
      </p>
      <RegisterForm />
    </>
  );
}
