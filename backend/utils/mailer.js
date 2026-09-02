import nodemailer from "nodemailer";

export function createMailer() {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) return null;
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: String(process.env.EMAIL_SECURE || "false") === "true",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });
}

export async function sendVerificationEmail({ to, subject, heading, code }) {
  const transporter = createMailer();
  if (!transporter) throw new Error("Email service is not configured");

  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to,
    subject,
    text: `${heading} Your VITPEERS verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>${heading}</p><p>Your VITPEERS verification code is <strong>${code}</strong>.</p><p>This code expires in 10 minutes.</p>`,
  });

  console.log(`✉️  Email accepted by SMTP server for ${to}. Message ID: ${info.messageId}`);
}
