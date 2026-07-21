import nodemailer from "nodemailer";

// Thin wrapper over the same Gmail Workspace SMTP credentials the NextAuth
// magic-link provider uses (see auth.ts). Kept separate so transactional
// notifications (e.g. a new sample request) can send server-side without
// touching the auth config. Fails soft: if SMTP is not configured we log and
// return rather than throwing, so a form submission still persists.

export interface MailInput {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  cc?: string | string[];
}

function getTransport() {
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;
  if (!user || !pass) return null;
  const host = process.env.EMAIL_SERVER_HOST ?? "smtp.gmail.com";
  const port = Number(process.env.EMAIL_SERVER_PORT ?? 587);
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendMail(input: MailInput): Promise<boolean> {
  const transport = getTransport();
  if (!transport) {
    console.warn(
      "[mailer] EMAIL_SERVER_* not configured; skipping send:",
      input.subject,
    );
    return false;
  }
  await transport.sendMail({
    from: process.env.EMAIL_FROM ?? "simon@republicofheat.com",
    to: input.to,
    cc: input.cc,
    subject: input.subject,
    text: input.text,
    replyTo: input.replyTo,
  });
  return true;
}
