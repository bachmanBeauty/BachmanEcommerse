"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { TrackedOrder } from "@/types/catalog";

export type CheckoutState = { error?: string } | null;
export type TrackState = { error?: string; order?: TrackedOrder } | null;

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Please enter your full name."),
  customerPhone: z.string().trim().min(6, "Please enter a valid phone number."),
  customerEmail: z
    .string()
    .trim()
    .email("Please enter a valid email address.")
    .optional()
    .or(z.literal("")),
  shippingAddress: z.string().trim().min(10, "Please enter your full address."),
  shippingArea: z.string().trim().optional(),
  shippingCity: z.string().trim().min(2, "Please enter your city."),
  shippingDistrict: z.string().trim().optional(),
  shippingPostalCode: z.string().trim().optional(),
  shippingZoneId: z.string().uuid("Please choose a delivery area."),
  paymentMethod: z.enum(["cod"]),
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
    paymentMethod: "cod",
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  let items: z.infer<typeof itemsSchema>;
  try {
    items = itemsSchema.parse(JSON.parse(String(formData.get("items") ?? "[]")));
  } catch {
    return { error: "Your bag is empty or invalid. Please add items again." };
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
    return { error: error.message };
  }

  const order = data as {
    order_number?: string;
    total?: number;
    item_count?: number;
  } | null;

  if (!order?.order_number) {
    return { error: "Could not create the order. Please try again." };
  }

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

  redirect(
    `/order-confirmation?number=${encodeURIComponent(order.order_number)}`,
  );
}

export async function trackOrder(
  _previousState: TrackState,
  formData: FormData,
): Promise<TrackState> {
  const parsed = z
    .object({
      orderNumber: z.string().trim().min(3, "Enter your order number."),
      phone: z.string().trim().min(6, "Enter the phone number used at checkout."),
    })
    .safeParse({
      orderNumber: String(formData.get("orderNumber") ?? ""),
      phone: String(formData.get("phone") ?? ""),
    });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_order_tracking", {
    p_order_number: parsed.data.orderNumber,
    p_phone: parsed.data.phone,
  });

  if (error) {
    return { error: "We could not look up that order. Please try again." };
  }

  if (!data) {
    return {
      error:
        "No order found with that number and phone. Please check and try again.",
    };
  }

  return { order: data as TrackedOrder };
}
