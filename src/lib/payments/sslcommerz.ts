type SessionOrder = {
  order_number: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: string;
  shipping_city: string;
};

export function isSslcommerzEnabled() {
  return Boolean(
    process.env.SSLCZ_STORE_ID && process.env.SSLCZ_STORE_PASSWORD,
  );
}

function gatewayBase() {
  return process.env.SSLCZ_SANDBOX === "false"
    ? "https://securepay.sslcommerz.com"
    : "https://sandbox.sslcommerz.com";
}

export async function createSslcommerzSession(order: SessionOrder) {
  const storeId = process.env.SSLCZ_STORE_ID!;
  const storePassword = process.env.SSLCZ_STORE_PASSWORD!;
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const body = new URLSearchParams({
    store_id: storeId,
    store_passwd: storePassword,
    total_amount: String(order.total),
    currency: "BDT",
    tran_id: order.order_number,
    success_url: `${siteUrl}/api/payments/sslcommerz/success`,
    fail_url: `${siteUrl}/api/payments/sslcommerz/fail`,
    cancel_url: `${siteUrl}/api/payments/sslcommerz/cancel`,
    ipn_url: `${siteUrl}/api/payments/sslcommerz/ipn`,
    cus_name: order.customer_name,
    cus_email: order.customer_email ?? "customer@example.com",
    cus_phone: order.customer_phone,
    cus_add1: order.shipping_address,
    cus_city: order.shipping_city,
    cus_country: "Bangladesh",
    shipping_method: "NO",
    product_name: "Bachman Beauty order",
    product_category: "Skincare",
    product_profile: "general",
  });

  const response = await fetch(`${gatewayBase()}/gwprocess/v4/api.php`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    throw new Error("Could not reach the payment gateway.");
  }

  const data = (await response.json()) as {
    status?: string;
    GatewayPageURL?: string;
    failedreason?: string;
  };

  if (data.status !== "SUCCESS" || !data.GatewayPageURL) {
    throw new Error(data.failedreason || "Payment session was not created.");
  }

  return data.GatewayPageURL;
}

export async function validateSslcommerzPayment(valId: string) {
  const storeId = process.env.SSLCZ_STORE_ID;
  const storePassword = process.env.SSLCZ_STORE_PASSWORD;

  if (!storeId || !storePassword || !valId) return null;

  const url = new URL(
    `${gatewayBase()}/validator/api/validationserverAPI.php`,
  );
  url.searchParams.set("val_id", valId);
  url.searchParams.set("store_id", storeId);
  url.searchParams.set("store_passwd", storePassword);
  url.searchParams.set("format", "json");

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) return null;

  const data = (await response.json()) as {
    status?: string;
    amount?: string;
    tran_id?: string;
    bank_tran_id?: string;
    currency?: string;
  };

  if (!data.status || !["VALID", "VALIDATED"].includes(data.status)) {
    return null;
  }

  return data;
}
