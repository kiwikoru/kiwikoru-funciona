import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { env } from "./lib/env.js";
import { Resend } from "resend";

const FROM_EMAIL =
  env.emailFrom ||
  process.env.RESEND_FROM ||
  "KiwiKoru 3D <no-reply@kiwikoru.co.nz>";

const TO_EMAIL =
  env.emailTo ||
  process.env.RESEND_TO ||
  "kiwikoru3d@gmail.com";

const SITE_URL =
  process.env.PUBLIC_SITE_URL ||
  process.env.VITE_PUBLIC_SITE_URL ||
  "https://kiwikoru.co.nz";

const LOGO_URL =
  process.env.EMAIL_LOGO_URL ||
  `${SITE_URL.replace(/\/$/, "")}/images/logo.png`;

const WHATSAPP_URL =
  "https://wa.me/640272602954?text=Hi%20KiwiKoru%203D%2C%20I%27d%20like%20to%20add%20some%20information%20to%20my%20enquiry.";

const BRAND = {
  forest: "#1f3d2e",
  forestLight: "#315c46",
  gold: "#c9a96e",
  cream: "#f7f4ed",
  charcoal: "#1f2933",
  muted: "#667085",
  border: "#e7e5df",
  white: "#ffffff",
};

function getResendClient() {
  const apiKey = env.resendApiKey || process.env.RESEND_API_KEY || "";
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function escapeHtml(value: string | undefined | null) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeHtml(value: string | undefined | null) {
  return escapeHtml(value).replace(/\n/g, "<br/>");
}

function cleanBase64(content: string) {
  if (!content) return "";
  if (content.includes(",")) return content.split(",")[1];
  return content;
}

function createAttachments(files?: { name: string; type?: string; content: string }[]) {
  if (!files || files.length === 0) return undefined;
  return files.filter((file) => file.content).map((file) => ({
    filename: file.name,
    content: cleanBase64(file.content),
  }));
}

function renderMessageHtml(message: string) {
  return message.split(/\r?\n/).map((line) => {
    const trimmed = line.trim();
    const downloadMatch = trimmed.match(/^Download link(?: \(valid for 7 days\))?:\s*(https?:\/\/\S+)$/i);

    if (downloadMatch) {
      const url = escapeHtml(downloadMatch[1]);
      return `<div style="margin:14px 0 18px;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="display:inline-block;background:${BRAND.forest};color:${BRAND.white};text-decoration:none;font-weight:700;font-size:14px;padding:13px 18px;border-radius:8px;">Download file</a><div style="margin-top:7px;font-size:12px;color:${BRAND.muted};">Link valid for 7 days</div></div>`;
    }

    if (!trimmed) return '<div style="height:8px;line-height:8px;">&nbsp;</div>';
    if (/^===.*===$/.test(trimmed)) {
      return `<h3 style="margin:18px 0 8px;color:${BRAND.forest};font-size:16px;">${escapeHtml(trimmed.replaceAll("=", "").trim())}</h3>`;
    }
    if (/^---.*---$/.test(trimmed)) {
      return `<h4 style="margin:16px 0 6px;color:${BRAND.charcoal};font-size:14px;">${escapeHtml(trimmed.replaceAll("-", "").trim())}</h4>`;
    }
    return `<p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;line-height:1.6;">${escapeHtml(line)}</p>`;
  }).join("");
}

function emailShell(content: string, preheader: string) {
  return `<!doctype html><html><body style="margin:0;padding:0;background:${BRAND.cream};"><div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preheader)}</div><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:${BRAND.cream};"><tr><td align="center" style="padding:24px 12px;"><table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:640px;background:${BRAND.white};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;"><tr><td align="center" style="background:${BRAND.forest};padding:28px 24px;"><img src="${escapeHtml(LOGO_URL)}" width="72" height="72" alt="KiwiKoru 3D" style="display:block;width:72px;height:72px;border-radius:16px;object-fit:cover;margin:0 auto 12px;"/><div style="font-family:Arial,sans-serif;color:${BRAND.white};font-size:22px;font-weight:700;">KiwiKoru 3D</div><div style="font-family:Arial,sans-serif;color:#d8e3dc;font-size:13px;margin-top:5px;">Your Ideas. Made Real. Made in NZ.</div></td></tr><tr><td style="padding:30px 28px;font-family:Arial,sans-serif;">${content}</td></tr><tr><td align="center" style="background:#f3f0e8;border-top:1px solid ${BRAND.border};padding:20px 24px;font-family:Arial,sans-serif;"><div style="font-size:12px;color:${BRAND.muted};line-height:1.6;">KiwiKoru 3D · Whangārei, Northland, New Zealand<br/><a href="mailto:${escapeHtml(TO_EMAIL)}" style="color:${BRAND.forestLight};text-decoration:none;">${escapeHtml(TO_EMAIL)}</a></div></td></tr></table></td></tr></table></body></html>`;
}

const fileInput = z.object({ name: z.string(), type: z.string().optional(), content: z.string() });
const contactInput = z.object({
  name: z.string().min(1), company: z.string().optional(), email: z.string().email(), phone: z.string().optional(),
  subject: z.string().min(1), projectType: z.string().optional(), message: z.string().min(1), quoteRef: z.string().optional(), files: z.array(fileInput).optional(),
});
const quoteInput = z.object({
  name: z.string().min(1), email: z.string().email(), phone: z.string().optional(), description: z.string().min(1),
  quantity: z.string().optional(), material: z.string().optional(), files: z.array(fileInput).optional(),
});

function ownerEmailHtml(input: z.infer<typeof contactInput>, attachmentsCount: number) {
  return emailShell(`<h1 style="margin:0 0 20px;color:${BRAND.forest};font-size:24px;">New website enquiry</h1>
  <p><strong>Name:</strong> ${safeHtml(input.name)}</p><p><strong>Company:</strong> ${safeHtml(input.company || "-")}</p>
  <p><strong>Email:</strong> <a href="mailto:${escapeHtml(input.email)}">${safeHtml(input.email)}</a></p><p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
  <p><strong>Subject:</strong> ${safeHtml(input.subject)}</p><p><strong>Project type:</strong> ${safeHtml(input.projectType || "-")}</p>
  <p><strong>Quote reference:</strong> ${safeHtml(input.quoteRef || "-")}</p><p><strong>Email attachments:</strong> ${attachmentsCount}</p>
  <div style="height:1px;background:${BRAND.border};margin:22px 0;"></div>
  <div style="background:#faf9f6;border:1px solid ${BRAND.border};border-radius:12px;padding:18px;">${renderMessageHtml(input.message)}</div>
  <div style="margin-top:22px;"><a href="mailto:${escapeHtml(input.email)}" style="display:inline-block;background:${BRAND.gold};color:${BRAND.forest};text-decoration:none;font-weight:700;padding:13px 18px;border-radius:8px;">Reply to ${safeHtml(input.name)}</a></div>`, `New enquiry from ${input.name}`);
}

function clientEmailHtml(name: string, isQuote = false) {
  const heading = isQuote ? "Thanks — we’ve received your quote request" : "Thanks for getting in touch";
  const intro = isQuote
    ? "Your quote request is safely with us. We’ll review the details and any files you included, then get back to you with the next steps."
    : "Your message is safely with us. We’ll review everything carefully and get back to you as soon as possible.";

  return emailShell(`<h1 style="margin:0 0 16px;color:${BRAND.forest};font-size:25px;">${heading}</h1>
  <p style="font-size:15px;line-height:1.7;color:${BRAND.charcoal};">Hi ${safeHtml(name)},</p>
  <p style="font-size:15px;line-height:1.7;color:${BRAND.charcoal};">${intro}</p>
  <p style="font-size:15px;line-height:1.7;color:${BRAND.charcoal};">We normally reply within 24 hours. If there’s anything else you’d like to add, you’re very welcome to message us on WhatsApp.</p>
  <table role="presentation" cellspacing="0" cellpadding="0"><tr><td style="padding:0 10px 10px 0;"><a href="${escapeHtml(WHATSAPP_URL)}" target="_blank" style="display:inline-block;background:#25D366;color:#fff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:8px;">Message us on WhatsApp</a></td><td style="padding:0 0 10px;"><a href="mailto:${escapeHtml(TO_EMAIL)}" style="display:inline-block;background:${BRAND.forest};color:#fff;text-decoration:none;font-weight:700;padding:13px 18px;border-radius:8px;">Email KiwiKoru 3D</a></td></tr></table>
  <p style="margin-top:22px;font-size:15px;line-height:1.7;color:${BRAND.charcoal};">Warm regards,<br/><strong>Rodrigo and the KiwiKoru 3D team</strong></p>`, isQuote ? "We’ve received your KiwiKoru 3D quote request." : "We’ve received your message and will be in touch soon.");
}

async function sendContactEmails(input: z.infer<typeof contactInput>) {
  const resend = getResendClient();
  const attachments = createAttachments(input.files);
  if (!resend) return { success: false, emailSent: false, note: "Email not sent. RESEND_API_KEY is missing in Vercel." };

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL, to: TO_EMAIL, replyTo: input.email,
    subject: `[KiwiKoru] ${input.subject} — ${input.name}`,
    html: ownerEmailHtml(input, attachments?.length || 0), attachments,
  });
  if (ownerEmail.error) return { success: false, emailSent: false, note: ownerEmail.error.message || "Owner email failed." };

  const clientEmail = await resend.emails.send({
    from: FROM_EMAIL, to: input.email, replyTo: TO_EMAIL,
    subject: "Thanks for getting in touch — KiwiKoru 3D",
    html: clientEmailHtml(input.name, input.subject === "Get a Quote"),
  });
  if (clientEmail.error) console.error("[EMAIL CLIENT ERROR]", clientEmail.error);

  return { success: true, emailSent: true, message: "Emails sent successfully", filesReceived: input.files?.length || 0, attachmentsSent: attachments?.length || 0 };
}

async function sendQuoteEmails(input: z.infer<typeof quoteInput>) {
  const resend = getResendClient();
  const attachments = createAttachments(input.files);
  if (!resend) return { success: false, emailSent: false, note: "Email not sent. RESEND_API_KEY is missing in Vercel." };

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL, to: TO_EMAIL, replyTo: input.email,
    subject: `New quote request from ${input.name}`,
    html: emailShell(`<h1 style="margin:0 0 20px;color:${BRAND.forest};font-size:24px;">New quote request</h1>
    <p><strong>Name:</strong> ${safeHtml(input.name)}</p><p><strong>Email:</strong> ${safeHtml(input.email)}</p><p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
    <p><strong>Quantity:</strong> ${safeHtml(input.quantity || "-")}</p><p><strong>Material:</strong> ${safeHtml(input.material || "-")}</p>
    <div style="height:1px;background:${BRAND.border};margin:22px 0;"></div><div style="background:#faf9f6;border:1px solid ${BRAND.border};border-radius:12px;padding:18px;">${renderMessageHtml(input.description)}</div>`, `New quote request from ${input.name}`),
    attachments,
  });
  if (ownerEmail.error) return { success: false, emailSent: false, note: ownerEmail.error.message || "Quote email failed." };

  const clientEmail = await resend.emails.send({
    from: FROM_EMAIL, to: input.email, replyTo: TO_EMAIL,
    subject: "We received your quote request — KiwiKoru 3D",
    html: clientEmailHtml(input.name, true),
  });
  if (clientEmail.error) console.error("[EMAIL QUOTE CLIENT ERROR]", clientEmail.error);

  return { success: true, emailSent: true, message: "Quote emails sent successfully", filesReceived: input.files?.length || 0 };
}

export const emailRouter = createRouter({
  send: publicQuery.input(contactInput).mutation(async ({ input }) => sendContactEmails(input)),
  sendContact: publicQuery.input(contactInput).mutation(async ({ input }) => sendContactEmails(input)),
  sendQuote: publicQuery.input(quoteInput).mutation(async ({ input }) => sendQuoteEmails(input)),
});
