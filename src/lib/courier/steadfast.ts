export function isSteadfastEnabled() {
  return Boolean(
    process.env.STEADFAST_API_KEY && process.env.STEADFAST_SECRET_KEY,
  );
}

type CourierOrder = {
  invoice: string;
  recipient_name: string;
  recipient_phone: string;
  recipient_address: string;
  cod_amount: number;
  note: string;
};

export async function createSteadfastOrder(order: CourierOrder) {
  const base =
    process.env.STEADFAST_BASE_URL ?? "https://portal.packzy.com/api/v1";

  const response = await fetch(`${base}/create_order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Api-Key": process.env.STEADFAST_API_KEY!,
      "Secret-Key": process.env.STEADFAST_SECRET_KEY!,
    },
    body: JSON.stringify({
      invoice: order.invoice,
      recipient_name: order.recipient_name,
      recipient_phone: order.recipient_phone,
      recipient_address: order.recipient_address,
      cod_amount: order.cod_amount,
      note: order.note,
    }),
    cache: "no-store",
  });

  const data = (await response.json()) as {
    status?: number;
    message?: string;
    consignment?: {
      consignment_id?: number | string;
      tracking_code?: string;
      status?: string;
    };
  };

  if (!response.ok || (data.status && data.status >= 400) || !data.consignment) {
    throw new Error(data.message || "Courier did not accept this order.");
  }

  return data.consignment;
}
