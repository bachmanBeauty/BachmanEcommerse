import { NextResponse, type NextRequest } from "next/server";
import { verifyAndMarkPaid } from "@/lib/payments/verify";

async function handle(request: NextRequest) {
  let valId = "";
  let tranId = "";

  if (request.method === "POST") {
    const form = await request.formData();
    valId = String(form.get("val_id") ?? "");
    tranId = String(form.get("tran_id") ?? "");
  }

  if (!tranId) {
    tranId = request.nextUrl.searchParams.get("tran_id") ?? "";
  }
  if (!valId) {
    valId = request.nextUrl.searchParams.get("val_id") ?? "";
  }

  const result = await verifyAndMarkPaid(valId);
  const number = result.orderNumber ?? tranId;

  return NextResponse.redirect(
    new URL(
      `/order-confirmation?number=${encodeURIComponent(number)}&payment=success`,
      request.url,
    ),
  );
}

export async function GET(request: NextRequest) {
  return handle(request);
}

export async function POST(request: NextRequest) {
  return handle(request);
}
