"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sendOrderEmail, sendOrderSms } from "@/lib/notifications";
import {
  createSslcommerzSession,
  isSslcommerzEnabled,
} from "@/lib/payments/sslcommerz";
import { createClient } from "@/lib/supabase/server";
import type { TrackedOrder } from "@/types/catalog";

export type CheckoutState = { error?: string } | null;
export type TrackState = { error?: string; order?: TrackedOrder } | null;

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "আপনার পূর্ণ নাম লিখুন।"),
  customerPhone: z.string().trim().min(6, "সঠিক ফোন নম্বর দিন।"),
  customerEmail: z
    .string()
    .trim()
    .email("সঠিক ইমেইল দিন।")
    .optional()
    .or(z.literal("")),
  shippingAddress: z.string().trim().min(10, "সম্পূর্ণ ঠিকানা লিখুন।"),
  shippingArea: z.string().trim().optional(),
  shippingCity: z.string().trim().min(2, "শহরের নাম লিখুন।"),
  shippingDistrict: z.string().trim().optional(),
  shippingPostalCode: z.string().trim().optional(),
  shippingZoneId: z.string().uuid("ডেলিভারি এলাকা বাছুন।"),
  paymentMethod: z.enum(["cod", "sslcommerz"]),
  note: z.string().trim().max(500).optional(),
});

const itemsSchema = z
  .array(
    z.object({
      variant_id: z.string().uuid(),
      quantity: z.number().int().min(1).max(99),
    }),
  )
  .min(1);

function orderError(message: string) {
  if (message.includes("Your bag is empty")) return "আপনার ব্যাগ খালি।";
  if (message.includes("Not enough stock for")) {
    return `স্টক পর্যাপ্ত নয়: ${message.replace("Not enough stock for", "").replace(/\.$/, "")}।`;
  }
  if (message.includes("no longer available")) {
    return "ব্যাগের একটি প্রোডাক্ট আর পাওয়া যাচ্ছে না।";
  }
  if (message.includes("valid delivery area")) {
    return "সঠিক ডেলিভারি এলাকা বাছুন।";
  }
  if (message.includes("Unsupported payment method")) {
    return "এই পেমেন্ট পদ্ধতি এখন সমর্থিত নয়।";
  }
  if (message.includes("full name")) return "আপনার পূর্ণ নাম লিখুন।";
  if (message.includes("valid phone")) return "সঠিক ফোন নম্বর দিন।";
  if (message.includes("full delivery address")) {
    return "সম্পূর্ণ ডেলিভারি ঠিকানা লিখুন।";
  }
  return "অর্ডার সম্পন্ন করা যায়নি। আবার চেষ্টা করুন।";
}

export async function placeOrder(
  _previousState: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    customerName: String(formData.get("customerName") ?? ""),
    customerPhone: String(formData.get("customerPhone") ?? ""),
    customerEmail: String(formData.get("customerEmail") ?? ""),
    shippingAddress: String(formData.get("shippingAddress") ?? ""),
    shippingArea: String(formData.get("shippingArea") ?? ""),
    shippingCity: String(formData.get("shippingCity") ?? ""),
    shippingDistrict: String(formData.get("shippingDistrict") ?? ""),
    shippingPostalCode: String(formData.get("shippingPostalCode") ?? ""),
    shippingZoneId: String(formData.get("shippingZoneId") ?? ""),
    paymentMethod: String(formData.get("paymentMethod") ?? "cod"),
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ফর্মটি আবার দেখুন।" };
  }

  let items: z.infer<typeof itemsSchema>;
  try {
    items = itemsSchema.parse(JSON.parse(String(formData.get("items") ?? "[]")));
  } catch {
    return { error: "আপনার ব্যাগ খালি বা সমস্যা আছে। আবার আইটেম যোগ করুন।" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("place_order", {
    p_customer_name: parsed.data.customerName,
    p_customer_phone: parsed.data.customerPhone,
    p_customer_email: parsed.data.customerEmail || null,
    p_shipping_address: parsed.data.shippingAddress,
    p_shipping_area: parsed.data.shippingArea || null,
    p_shipping_city: parsed.data.shippingCity,
    p_shipping_district: parsed.data.shippingDistrict || null,
    p_shipping_postal_code: parsed.data.shippingPostalCode || null,
    p_shipping_zone_id: parsed.data.shippingZoneId,
    p_payment_method: parsed.data.paymentMethod,
    p_customer_note: parsed.data.note || null,
    p_items: items,
  });

  if (error) {
    return { error: orderError(error.message) };
  }

  const order = data as {
    order_number?: string;
    total?: number;
    item_count?: number;
  } | null;

  if (!order?.order_number) {
    return { error: "অর্ডার তৈরি করা যায়নি। আবার চেষ্টা করুন।" };
  }

  await sendOrderEmail({
    to: parsed.data.customerEmail || null,
    subject: `Order ${order.order_number} received`,
    heading: "Thank you for your order",
    lines: [
      `Order number: ${order.order_number}`,
      `Total: BDT ${order.total ?? 0}`,
      "We will contact you shortly to confirm the delivery details.",
    ],
  });
  await sendOrderSms(
    parsed.data.customerPhone,
    `Bachman Beauty: order ${order.order_number} received. Total BDT ${order.total ?? 0}.`,
  );

  const cookieStore = await cookies();
  cookieStore.set(
    "bb_last_order",
    JSON.stringify({
      number: order.order_number,
      total: order.total ?? 0,
      itemCount: order.item_count ?? 0,
    }),
    {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 30,
    },
  );

  if (parsed.data.paymentMethod === "sslcommerz") {
    if (!isSslcommerzEnabled()) {
      return { error: "অনলাইন পেমেন্ট এখন পাওয়া যাচ্ছে না।" };
    }

    let gatewayUrl: string;
    try {
      gatewayUrl = await createSslcommerzSession({
        order_number: order.order_number,
        total: Number(order.total ?? 0),
        customer_name: parsed.data.customerName,
        customer_phone: parsed.data.customerPhone,
        customer_email: parsed.data.customerEmail || null,
        shipping_address: parsed.data.shippingAddress,
        shipping_city: parsed.data.shippingCity,
      });
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? orderError(error.message)
            : "অনলাইন পেমেন্ট শুরু করা যায়নি।",
      };
    }

    redirect(gatewayUrl);
  }

  redirect(
    `/order-confirmation?number=${encodeURIComponent(order.order_number)}&payment=cod`,
  );
}

export async function trackOrder(
  _previousState: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const parsed = z
    .object({
      orderNumber: z.string().trim().min(3, "অর্ডার নম্বর দিন।"),
      phone: z.string().trim().min(6, "চেকআউটে দেওয়া ফোন নম্বর দিন।"),
    })
    .safeParse({
      orderNumber: String(formData.get("orderNumber") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "ফর্মটি আবার দেখুন।" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_tracking", {
    p_order_number: parsed.data.orderNumber,
    p_phone: parsed.data.phone,
  });

  if (error) {
    return { error: "অর্ডারটি খোঁজা যায়নি। আবার চেষ্টা করুন।" };
  }

  if (!data) {
    return {
      error:
        "এই অর্ডার নম্বর ও ফোনে কোনো অর্ডার পাওয়া যায়নি। আবার দেখুন।",
    };
  }

  return { order: data as TrackedOrder };
}
