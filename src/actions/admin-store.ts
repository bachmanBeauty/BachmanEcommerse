"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { createSteadfastOrder, isSteadfastEnabled } from "@/lib/courier/steadfast";
import { bool, dateOrNull, numberOrNull, text } from "@/lib/form";
import { sendOrderEmail, sendOrderSms } from "@/lib/notifications";
import { slugify } from "@/lib/slug";
import { createClient } from "@/lib/supabase/server";

const orderStatuses = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
  "returned",
] as const;

const paymentStatuses = ["unpaid", "pending", "paid", "failed", "refunded"] as const;

export async function updateOrderStatus(formData: FormData) {
  const admin = await requireAdmin();
  const id = text(formData, "order_id");
  const status = text(formData, "status");

  if (!orderStatuses.includes(status as (typeof orderStatuses)[number])) {
    throw new Error("Invalid order status.");
  }

  const supabase = await createClient();
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("status, order_number, customer_email, customer_phone")
    .eq("id", id)
    .single();

  if (fetchError || !order) throw new Error("Order not found.");

  const { error } = await supabase
    .from("orders")
    .update({
      status,
      cancelled_at:
        status === "cancelled" ? new Date().toISOString() : undefined,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("order_status_history").insert({
    order_id: id,
    status,
    note: text(formData, "note") || null,
    changed_by: admin.id,
  });

  if (order.status !== status) {
    await sendOrderEmail({
      to: order.customer_email,
      subject: `Order ${order.order_number} is now ${status}`,
      heading: `Your order is ${status}`,
      lines: [
        `Order number: ${order.order_number}`,
        `New status: ${status}`,
        "Thank you for shopping with Bachman Beauty.",
      ],
    });
    await sendOrderSms(
      order.customer_phone,
      `Bachman Beauty: order ${order.order_number} status: ${status}.`,
    );
  }

  const closing = status === "cancelled" || status === "returned";
  const wasClosed = order.status === "cancelled" || order.status === "returned";

  if (closing && !wasClosed) {
    const { data: items } = await supabase
      .from("order_items")
      .select("variant_id, quantity")
      .eq("order_id", id);

    for (const item of items ?? []) {
      if (!item.variant_id) continue;
      const { data: variant } = await supabase
        .from("product_variants")
        .select("stock_quantity")
        .eq("id", item.variant_id)
        .single();
      if (variant) {
        await supabase
          .from("product_variants")
          .update({ stock_quantity: variant.stock_quantity + item.quantity })
          .eq("id", item.variant_id);
      }
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/shop");
}

export async function updatePaymentStatus(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "order_id");
  const status = text(formData, "payment_status");

  if (!paymentStatuses.includes(status as (typeof paymentStatuses)[number])) {
    throw new Error("Invalid payment status.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ payment_status: status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/payments");
  revalidatePath(`/admin/orders/${id}`);
}

export async function updateOrderNote(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "order_id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ admin_note: text(formData, "admin_note") || null })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(`/admin/orders/${id}`);
}

export async function createCoupon(formData: FormData) {
  await requireAdmin();
  const code = text(formData, "code").toUpperCase();
  if (!code) throw new Error("Coupon code is required.");

  const supabase = await createClient();
  const { error } = await supabase.from("coupons").insert({
    code,
    description: text(formData, "description") || null,
    discount_type: text(formData, "discount_type") === "fixed" ? "fixed" : "percentage",
    discount_value: Number(text(formData, "discount_value") || 0),
    min_order_amount: Number(text(formData, "min_order_amount") || 0),
    max_discount_amount: numberOrNull(formData, "max_discount_amount"),
    starts_at: dateOrNull(formData, "starts_at"),
    ends_at: dateOrNull(formData, "ends_at"),
    usage_limit: numberOrNull(formData, "usage_limit"),
    per_user_limit: numberOrNull(formData, "per_user_limit"),
    is_active: bool(formData, "is_active"),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function updateCoupon(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({
      code: text(formData, "code").toUpperCase(),
      description: text(formData, "description") || null,
      discount_type: text(formData, "discount_type") === "fixed" ? "fixed" : "percentage",
      discount_value: Number(text(formData, "discount_value") || 0),
      min_order_amount: Number(text(formData, "min_order_amount") || 0),
      max_discount_amount: numberOrNull(formData, "max_discount_amount"),
      starts_at: dateOrNull(formData, "starts_at"),
      ends_at: dateOrNull(formData, "ends_at"),
      usage_limit: numberOrNull(formData, "usage_limit"),
      per_user_limit: numberOrNull(formData, "per_user_limit"),
      is_active: bool(formData, "is_active"),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  revalidatePath(`/admin/coupons/${id}`);
}

export async function deleteCoupon(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("coupons").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
  redirect("/admin/coupons");
}

export async function toggleCoupon(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const isActive = bool(formData, "is_active");
  const supabase = await createClient();
  const { error } = await supabase
    .from("coupons")
    .update({ is_active: !isActive })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function createZone(formData: FormData) {
  await requireAdmin();
  const name = text(formData, "name");
  if (!name) throw new Error("Zone name is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("shipping_zones").insert({
    name,
    charge: Number(text(formData, "charge") || 0),
    free_shipping_threshold: numberOrNull(formData, "free_shipping_threshold"),
    estimated_days: text(formData, "estimated_days") || null,
    is_active: bool(formData, "is_active"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
}

export async function updateZone(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("shipping_zones")
    .update({
      name: text(formData, "name"),
      charge: Number(text(formData, "charge") || 0),
      free_shipping_threshold: numberOrNull(formData, "free_shipping_threshold"),
      estimated_days: text(formData, "estimated_days") || null,
      is_active: bool(formData, "is_active"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
}

export async function deleteZone(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("shipping_zones").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/delivery");
  revalidatePath("/checkout");
}

export async function setReviewApproval(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const approved = bool(formData, "approved");
  const supabase = await createClient();
  const { error } = await supabase
    .from("reviews")
    .update({ is_approved: approved })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
  revalidatePath("/shop");
}

export async function deleteReview(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/reviews");
}

export async function createBanner(formData: FormData) {
  await requireAdmin();
  const imageUrl = text(formData, "image_url");
  if (!imageUrl) throw new Error("Banner image URL is required.");
  const supabase = await createClient();
  const { error } = await supabase.from("banners").insert({
    title: text(formData, "title") || null,
    subtitle: text(formData, "subtitle") || null,
    image_url: imageUrl,
    link_url: text(formData, "link_url") || null,
    sort_order: Number(text(formData, "sort_order") || 0),
    is_active: bool(formData, "is_active"),
    starts_at: dateOrNull(formData, "starts_at"),
    ends_at: dateOrNull(formData, "ends_at"),
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function updateBanner(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase
    .from("banners")
    .update({
      title: text(formData, "title") || null,
      subtitle: text(formData, "subtitle") || null,
      image_url: text(formData, "image_url"),
      link_url: text(formData, "link_url") || null,
      sort_order: Number(text(formData, "sort_order") || 0),
      is_active: bool(formData, "is_active"),
      starts_at: dateOrNull(formData, "starts_at"),
      ends_at: dateOrNull(formData, "ends_at"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const title = text(formData, "title");
  if (!title) throw new Error("Post title is required.");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  const publishedAt = dateOrNull(formData, "published_at");

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert({
      title,
      slug: text(formData, "slug") || slugify(title),
      excerpt: text(formData, "excerpt") || null,
      content: text(formData, "content") || null,
      cover_image_url: text(formData, "cover_image_url") || null,
      status,
      published_at:
        status === "published" ? (publishedAt ?? new Date().toISOString()) : null,
      meta_title: text(formData, "meta_title") || null,
      meta_description: text(formData, "meta_description") || null,
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect(`/admin/blog/${data.id}`);
}

export async function updatePost(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const status = text(formData, "status") === "published" ? "published" : "draft";
  const publishedAt = dateOrNull(formData, "published_at");

  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({
      title: text(formData, "title"),
      slug: text(formData, "slug"),
      excerpt: text(formData, "excerpt") || null,
      content: text(formData, "content") || null,
      cover_image_url: text(formData, "cover_image_url") || null,
      status,
      published_at:
        status === "published" ? (publishedAt ?? new Date().toISOString()) : null,
      meta_title: text(formData, "meta_title") || null,
      meta_description: text(formData, "meta_description") || null,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  revalidatePath(`/admin/blog/${id}`);
}

export async function deletePost(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  const supabase = await createClient();
  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/blog");
  redirect("/admin/blog");
}

export async function updateSettings(formData: FormData) {
  await requireAdmin();
  const supabase = await createClient();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    store_name: text(formData, "store_name") || "Bachman Beauty",
    store_email: text(formData, "store_email") || null,
    store_phone: text(formData, "store_phone") || null,
    store_address: text(formData, "store_address") || null,
    facebook_url: text(formData, "facebook_url") || null,
    instagram_url: text(formData, "instagram_url") || null,
    currency: text(formData, "currency") || "BDT",
    tax_percentage: Number(text(formData, "tax_percentage") || 0),
    free_shipping_threshold: numberOrNull(formData, "free_shipping_threshold"),
    updated_at: new Date().toISOString(),
  });

  if (error) throw new Error(error.message);
  revalidatePath("/admin/settings");
  revalidatePath("/", "layout");
}

export async function setUserRole(formData: FormData) {  const admin = await requireAdmin();
  const userId = text(formData, "user_id");
  const role = text(formData, "role");

  if (role !== "admin" && role !== "customer") {
    throw new Error("Invalid role.");
  }
  if (userId === admin.id) {
    throw new Error("You cannot change your own role.");
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("user_roles")
    .update({ role })
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/roles");
  revalidatePath("/admin/customers");
}

export async function sendToCourier(formData: FormData) {
  await requireAdmin();

  if (!isSteadfastEnabled()) {
    throw new Error(
      "Courier is not configured. Add STEADFAST_API_KEY and STEADFAST_SECRET_KEY.",
    );
  }

  const id = text(formData, "order_id");
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!order) throw new Error("Order not found.");
  if (order.courier_consignment_id) {
    throw new Error("This order was already sent to the courier.");
  }

  const consignment = await createSteadfastOrder({
    invoice: order.order_number,
    recipient_name: order.customer_name,
    recipient_phone: order.customer_phone,
    recipient_address: [
      order.shipping_address,
      order.shipping_area,
      order.shipping_city,
      order.shipping_district,
      order.shipping_postal_code,
    ]
      .filter(Boolean)
      .join(", "),
    cod_amount: Number(order.total),
    note: order.customer_note ?? "",
  });

  const { error } = await supabase
    .from("orders")
    .update({
      courier_name: "Steadfast",
      courier_consignment_id: String(consignment.consignment_id ?? ""),
      courier_tracking_code: consignment.tracking_code ?? null,
      courier_status: consignment.status ?? "in_review",
      courier_sent_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);

  await supabase.from("order_status_history").insert({
    order_id: id,
    status: order.status,
    note: `Sent to Steadfast (${
      consignment.tracking_code ?? consignment.consignment_id ?? "pending"
    })`,
    changed_by: null,
  });

  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin/orders");
}
