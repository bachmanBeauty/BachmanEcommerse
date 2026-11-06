import { NextResponse, type NextRequest } from "next/server";

function orderNumberFrom(request: NextRequest, body?: FormData) {
  return String(
    body?.get("tran_id") ??
      request.nextUrl.searchParams.get("tran_id") ??
      "",
  );
}

async function redirectCancelled(request: NextRequest) {
  let number = "";
  if (request.method === "POST") {
    const form = await request.formData();
    number = orderNumberFrom(request, form);
  } else {
    number = orderNumberFrom(request);
  }

  return NextResponse.redirect(
    new URL(
      `/order-confirmation?number=${encodeURIComponent(number)}&payment=cancelled`,
      request.url,
    ),
  );
}

export async function GET(request: NextRequest) {
  return redirectCancelled(request);
}

export async function POST(request: NextRequest) {
  return redirectCancelled(request);
}
