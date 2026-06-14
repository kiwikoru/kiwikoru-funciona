import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { env } from "./lib/env.js";
import { Resend } from "resend";

const FROM_EMAIL =
  env.emailFrom ||
  process.env.RESEND_FROM ||
  "Kiwi Koru 3D <no-reply@kiwikoru.co.nz>";

const TO_EMAIL =
  env.emailTo ||
  process.env.RESEND_TO ||
  "kiwikoru3d@gmail.com";

function getResendClient() {
  const apiKey = env.resendApiKey || process.env.RESEND_API_KEY || "";

  if (!apiKey) {
    console.error("[EMAIL] Missing RESEND_API_KEY", {
      envKeys: Object.keys(process.env).filter((key) => key.includes("RESEND")),
    });

    return null;
  }

  return new Resend(apiKey);
}

function safeHtml(value: string | undefined | null) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
    .replace(/\n/g, "<br/>");
}

function cleanBase64(content: string) {
  if (!content) return "";
  if (content.includes(",")) return content.split(",")[1];
  return content;
}

function createAttachments(
  files?: { name: string; type?: string; content: string }[]
) {
  if (!files || files.length === 0) return undefined;

  return files
    .filter((file) => file.content && file.content.length > 0)
    .map((file) => ({
      filename: file.name,
      content: cleanBase64(file.content),
    }));
}

const fileInput = z.object({
  name: z.string(),
  type: z.string().optional(),
  content: z.string(),
});

const contactInput = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(1),
  projectType: z.string().optional(),
  message: z.string().min(1),
  quoteRef: z.string().optional(),
  files: z.array(fileInput).optional(),
});

const quoteInput = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  description: z.string().min(1),
  quantity: z.string().optional(),
  material: z.string().optional(),
  files: z.array(fileInput).optional(),
});

async function sendContactEmails(input: z.infer<typeof contactInput>) {
  const resend = getResendClient();
  const attachments = createAttachments(input.files);

  console.log("[EMAIL CONTACT]", {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    replyTo: input.email,
    filesCount: input.files?.length || 0,
    filesNames: input.files?.map((file) => file.name) || [],
    attachmentsCount: attachments?.length || 0,
  });

  if (!resend) {
    return {
      success: false,
      emailSent: false,
      note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
    };
  }

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `[KiwiKoru] ${input.subject} — ${input.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New enquiry from Kiwi Koru 3D website</h2>

        <p><strong>Name:</strong> ${safeHtml(input.name)}</p>
        <p><strong>Company:</strong> ${safeHtml(input.company || "-")}</p>
        <p><strong>Email:</strong> ${safeHtml(input.email)}</p>
        <p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
        <p><strong>Subject:</strong> ${safeHtml(input.subject)}</p>
        <p><strong>Project type:</strong> ${safeHtml(input.projectType || "-")}</p>
        <p><strong>Quote reference:</strong> ${safeHtml(input.quoteRef || "-")}</p>

        <hr />

        <p><strong>Attachments received:</strong> ${attachments?.length || 0}</p>
        <p><strong>Attachment names:</strong> ${safeHtml(input.files?.map((file) => file.name).join(", ") || "-")}</p>

        <hr />

        <p><strong>Message:</strong></p>
        <p>${safeHtml(input.message)}</p>
      </div>
    `,
    attachments,
  });

  if (ownerEmail.error) {
    console.error("[EMAIL CONTACT ERROR]", ownerEmail.error);

    return {
      success: false,
      emailSent: false,
      note: ownerEmail.error.message || "Owner email failed.",
    };
  }

  const clientEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: input.email,
    subject: "We received your enquiry — Kiwi Koru 3D",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Thank you for contacting Kiwi Koru 3D</h2>

        <p>Hi ${safeHtml(input.name)},</p>
        <p>We have received your enquiry and will get back to you as soon as possible.</p>

        <p>
          If you need immediate assistance, please contact us at
          <strong>kiwikoru3d@gmail.com</strong>
          or through our WhatsApp chat available on our website.
        </p>

        <br />

        <p>Kind regards,</p>
        <p><strong>Kiwi Koru 3D</strong></p>
        <p>3D Printing, Design & Prototyping</p>
      </div>
    `,
  });

  if (clientEmail.error) {
    console.error("[EMAIL CLIENT ERROR]", clientEmail.error);
  }

  return {
    success: true,
    emailSent: true,
    message: "Emails sent successfully",
    filesReceived: input.files?.length || 0,
    attachmentsSent: attachments?.length || 0,
  };
}

async function sendQuoteEmails(input: z.infer<typeof quoteInput>) {
  const resend = getResendClient();
  const attachments = createAttachments(input.files);

  console.log("[EMAIL QUOTE]", {
    to: TO_EMAIL,
    from: FROM_EMAIL,
    replyTo: input.email,
    filesCount: input.files?.length || 0,
    filesNames: input.files?.map((file) => file.name) || [],
  });

  if (!resend) {
    return {
      success: false,
      emailSent: false,
      note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
    };
  }

  await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `New quote request from ${input.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>New quote request from Kiwi Koru 3D website</h2>

        <p><strong>Name:</strong> ${safeHtml(input.name)}</p>
        <p><strong>Email:</strong> ${safeHtml(input.email)}</p>
        <p><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
        <p><strong>Quantity:</strong> ${safeHtml(input.quantity || "-")}</p>
        <p><strong>Material:</strong> ${safeHtml(input.material || "-")}</p>

        <hr />

        <p><strong>Description:</strong></p>
        <p>${safeHtml(input.description)}</p>
      </div>
    `,
    attachments,
  });

  await resend.emails.send({
    from: FROM_EMAIL,
    to: input.email,
    subject: "We received your quote request — Kiwi Koru 3D",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
        <h2>Thank you for your quote request</h2>

        <p>Hi ${safeHtml(input.name)},</p>
        <p>We have received your quote request and will get back to you as soon as possible.</p>

        <p>
          If you need immediate assistance, please contact us at
          <strong>kiwikoru3d@gmail.com</strong>
          or through our WhatsApp chat available on our website.
        </p>

        <br />

        <p>Kind regards,</p>
        <p><strong>Kiwi Koru 3D</strong></p>
        <p>3D Printing, Design & Prototyping</p>
      </div>
    `,
  });

  return {
    success: true,
    emailSent: true,
    message: "Quote emails sent successfully",
    filesReceived: input.files?.length || 0,
  };
}

export const emailRouter = createRouter({
  send: publicQuery
    .input(contactInput)
    .mutation(async ({ input }) => {
      return sendContactEmails(input);
    }),

  sendContact: publicQuery
    .input(contactInput)
    .mutation(async ({ input }) => {
      return sendContactEmails(input);
    }),

  sendQuote: publicQuery
    .input(quoteInput)
    .mutation(async ({ input }) => {
      return sendQuoteEmails(input);
    }),
});
