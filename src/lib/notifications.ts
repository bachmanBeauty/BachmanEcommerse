type OrderEmailInput = {
  to: string | null;
  subject: string;
  heading: string;
  lines: string[];
};

export async function sendOrderEmail(input: OrderEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;

  if (!apiKey || !from || !input.to) return;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
      <h1 style="font-size:20px;margin:0 0 12px">${input.heading}</h1>
      ${input.lines.map((line) => `<p style="font-size:14px;color:#444;margin:6px 0">${line}</p>`).join("")}
      <p style="font-size:12px;color:#888;margin-top:24px">Bachman Beauty</p>
    </div>
  `;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: input.to,
        subject: input.subject,
        html,
      }),
      cache: "no-store",
    });
  } catch {
    // Notifications must never break the order flow.
  }
}

export async function sendOrderSms(phone: string, message: string) {
  const apiUrl = process.env.SMS_API_URL;
  const apiKey = process.env.SMS_API_KEY;
  const senderId = process.env.SMS_SENDER_ID;

  if (!apiUrl || !apiKey || !senderId) return;

  const body = new URLSearchParams({
    api_key: apiKey,
    type: "text",
    number: phone,
    senderid: senderId,
    message,
  });

  try {
    await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
  } catch {
    // Notifications must never break the order flow.
  }
}
