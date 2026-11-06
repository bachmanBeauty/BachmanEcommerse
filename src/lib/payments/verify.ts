import { createAdminClient } from "@/lib/supabase/admin";
import { validateSslcommerzPayment } from "@/lib/payments/sslcommerz";

export async function verifyAndMarkPaid(valId: string) {
  const validation = await validateSslcommerzPayment(valId);

  if (!validation?.tran_id || !validation.amount) {
    return { ok: false, orderNumber: null };
  }

  const admin = createAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("order_number", validation.tran_id)
    .maybeSingle();

  if (!order) {
    return { ok: false, orderNumber: validation.tran_id };
  }

  if (Number(validation.amount) + 0.01 < Number(order.total)) {
    return { ok: false, orderNumber: order.order_number };
  }

  if (order.payment_status !== "paid") {
    await admin
      .from("orders")
      .update({
        payment_status: "paid",
        status: order.status === "pending" ? "confirmed" : order.status,
      })
      .eq("id", order.id);

    await admin.from("payments").insert({
      order_id: order.id,
      provider: "sslcommerz",
      transaction_id: validation.bank_tran_id ?? validation.tran_id,
      amount: Number(validation.amount),
      status: "paid",
      raw_payload: validation,
      paid_at: new Date().toISOString(),
    });

    await admin.from("order_status_history").insert({
      order_id: order.id,
      status: "confirmed",
      note: "Payment confirmed via SSLCommerz",
      changed_by: null,
    });
  }

  return { ok: true, orderNumber: order.order_number };
}
