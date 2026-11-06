import { NextResponse, type NextRequest } from "next/server";

function orderNumberFrom(request: NextRequest, body?: FormData) {
  return String(
    body?.get("tran_id") ??
      request.nextUrl.searchParams.get("tran_id") ??
      "",
  );
}

async function redirectFailed(request: NextRequest, status: string) {
  let number = "";
  if (request.method === "POST") {
    const form = await request.formData();
    number = orderNumberFrom(request, form);
  } else {
    number = orderNumberFrom(request);
  }

  return NextResponse.redirect(
    new URL(
      `/order-confirmation?number=${encodeURIComponent(number)}&payment=${status}`,
      request.url,
    ),
  );
}

export async function GET(request: NextRequest) {
  return redirectFailed(request, "cancelled");
}

export async function POST(request: NextRequest) {
  return redirectFailed(request, "failed");
}
