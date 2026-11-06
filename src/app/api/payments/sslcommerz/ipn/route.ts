import { NextResponse, type NextRequest } from "next/server";
import { verifyAndMarkPaid } from "@/lib/payments/verify";

export async function POST(request: NextRequest) {
  const form = await request.formData();
  const valId = String(form.get("val_id") ?? "");
  const result = await verifyAndMarkPaid(valId);

  return NextResponse.json({ received: true, verified: result.ok });
}
