// Sends emails via Brevo's transactional email API (instead of raw SMTP).
// Requires two environment variables on the backend:
//   BREVO_API_KEY       - the API key you generated in Brevo (SMTP & API > API Keys)
//   EMAIL_FROM_ADDRESS  - the verified sender email (e.g. your VITPEERS Brevo sender)

const BREVO_ENDPOINT = "https://api.brevo.com/v3/smtp/email";

export async function sendVerificationEmail({ to, subject, heading, code }) {
  const apiKey = process.env.BREVO_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;

  if (!apiKey || !fromAddress) {
    throw new Error("Email service is not configured");
  }

  const response = await fetch(BREVO_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: { name: "VITPEERS", email: fromAddress },
      to: [{ email: to }],
      subject,
      htmlContent: `<p>${heading}</p><p>Your VITPEERS verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
      textContent: `${heading} Your VITPEERS verification code is ${code}. It expires in 10 minutes.`,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Brevo API error:", response.status, errorBody);
    throw new Error("Email service is not configured correctly");
  }

  const data = await response.json();
  console.log(`✉️  Email accepted by Brevo for ${to}. Message ID: ${data.messageId}`);
}