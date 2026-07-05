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
  forest: "#1F3D2E",
  forestLight: "#315C46",
  gold: "#C9A96E",
  cream: "#F7F4ED",
  charcoal: "#1F2933",
  muted: "#667085",
  border: "#E7E5DF",
  white: "#FFFFFF",
};

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

function renderMessageWithDownloadButtons(message: string) {
  const lines = message.split(/\r?\n/)
  const rendered: string[] = []

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index]
    const trimmed = line.trim()

    const downloadMatch = trimmed.match(
      /^Download link(?:\s*\(valid for 7 days\))?:\s*(https?:\/\/\S+)$/i
    )

    if (downloadMatch) {
      const downloadUrl = escapeHtml(downloadMatch[1])
      const nextLine = lines[index + 1]?.trim() || ""
      const previewMatch = nextLine.match(
        /^Preview image:\s*(https?:\/\/\S+)$/i
      )

      const previewHtml = previewMatch
        ? `
            <td
              width="150"
              valign="top"
              style="width:150px;padding:0 16px 0 0;"
            >
              <img
                src="${escapeHtml(previewMatch[1])}"
                width="134"
                alt="3D model preview"
                style="
                  display:block;
                  width:134px;
                  max-width:134px;
                  height:auto;
                  border:1px solid ${BRAND.border};
                  border-radius:10px;
                  background:${BRAND.cream};
                "
              />
            </td>
          `
        : ""

      rendered.push(`
        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            margin:14px 0 20px;
            border-collapse:collapse;
          "
        >
          <tr>
            ${previewHtml}
            <td valign="middle" style="padding:0;">
              <a
                href="${downloadUrl}"
                target="_blank"
                rel="noopener noreferrer"
                style="
                  display:inline-block;
                  background:${BRAND.forest};
                  color:${BRAND.white};
                  text-decoration:none;
                  font-family:Arial,sans-serif;
                  font-weight:700;
                  font-size:14px;
                  padding:13px 20px;
                  border-radius:8px;
                "
              >
                Download file
              </a>

              <div
                style="
                  margin-top:8px;
                  font-family:Arial,sans-serif;
                  font-size:12px;
                  line-height:1.5;
                  color:${BRAND.muted};
                "
              >
                Secure download link · valid for 7 days
              </div>
            </td>
          </tr>
        </table>
      `)

      if (previewMatch) {
        index += 1
      }

      continue
    }

    const previewOnlyMatch = trimmed.match(
      /^Preview image:\s*(https?:\/\/\S+)$/i
    )

    if (previewOnlyMatch) {
      rendered.push(`
        <div style="margin:12px 0 18px;">
          <img
            src="${escapeHtml(previewOnlyMatch[1])}"
            width="180"
            alt="3D model preview"
            style="
              display:block;
              width:180px;
              max-width:100%;
              height:auto;
              border:1px solid ${BRAND.border};
              border-radius:10px;
              background:${BRAND.cream};
            "
          />
        </div>
      `)
      continue
    }

    if (!trimmed) {
      rendered.push(
        '<div style="height:8px;line-height:8px;">&nbsp;</div>'
      )
      continue
    }

    if (/^===.*===$/.test(trimmed)) {
      rendered.push(`
        <h3
          style="
            margin:18px 0 8px;
            color:${BRAND.forest};
            font-family:Arial,sans-serif;
            font-size:16px;
            line-height:1.4;
          "
        >
          ${escapeHtml(trimmed.replaceAll("=", "").trim())}
        </h3>
      `)
      continue
    }

    if (/^---.*---$/.test(trimmed)) {
      rendered.push(`
        <h4
          style="
            margin:16px 0 6px;
            color:${BRAND.charcoal};
            font-family:Arial,sans-serif;
            font-size:14px;
            line-height:1.4;
          "
        >
          ${escapeHtml(trimmed.replaceAll("-", "").trim())}
        </h4>
      `)
      continue
    }

    rendered.push(`
      <p
        style="
          margin:5px 0;
          color:${BRAND.charcoal};
          font-family:Arial,sans-serif;
          font-size:14px;
          line-height:1.6;
        "
      >
        ${escapeHtml(line)}
      </p>
    `)
  }

  return rendered.join("")
}

function emailShell(content: string, preheader: string) {
  return `
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>KiwiKoru 3D</title>
      </head>
      <body style="margin:0;padding:0;background:${BRAND.cream};">
        <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
          ${escapeHtml(preheader)}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:${BRAND.cream};">
          <tr>
            <td align="center" style="padding:24px 12px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:640px;background:${BRAND.white};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
                <tr>
                  <td style="background:${BRAND.forest};padding:24px 28px;font-family:Arial,sans-serif;">
                    <div style="color:${BRAND.white};font-size:22px;font-weight:700;">
                      KiwiKoru 3D
                    </div>
                    <div style="color:#D8E3DC;font-size:13px;margin-top:5px;">
                      Your Ideas. Made Real. Made in NZ.
                    </div>
                  </td>
                </tr>

                <tr>
                  <td style="padding:30px 28px;font-family:Arial,sans-serif;">
                    ${content}
                  </td>
                </tr>

                <tr>
                  <td align="center" style="background:#F3F0E8;border-top:1px solid ${BRAND.border};padding:18px 24px;font-family:Arial,sans-serif;">
                    <div style="font-size:12px;color:${BRAND.muted};line-height:1.6;">
                      KiwiKoru 3D · Whangārei, Northland, New Zealand<br/>
                      <a href="mailto:${escapeHtml(TO_EMAIL)}" style="color:${BRAND.forestLight};text-decoration:none;">
                        ${escapeHtml(TO_EMAIL)}
                      </a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

function ownerEmailHtml(
  input: z.infer<typeof contactInput>,
  attachmentsCount: number
) {
  return emailShell(
    `
      <h1 style="margin:0 0 20px;color:${BRAND.forest};font-size:24px;line-height:1.3;">
        New website enquiry
      </h1>

      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-collapse:collapse;">
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;width:130px;">Name</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;font-weight:600;">${safeHtml(input.name)}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Company</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${safeHtml(input.company || "-")}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Email</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;"><a href="mailto:${escapeHtml(input.email)}" style="color:${BRAND.forestLight};">${safeHtml(input.email)}</a></td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Phone</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${safeHtml(input.phone || "-")}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Subject</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${safeHtml(input.subject)}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Project type</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${safeHtml(input.projectType || "-")}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Quote reference</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${safeHtml(input.quoteRef || "-")}</td></tr>
        <tr><td style="padding:7px 0;color:${BRAND.muted};font-size:13px;">Email attachments</td><td style="padding:7px 0;color:${BRAND.charcoal};font-size:14px;">${attachmentsCount}</td></tr>
      </table>

      <div style="height:1px;background:${BRAND.border};margin:22px 0;"></div>

      <h2 style="margin:0 0 12px;color:${BRAND.charcoal};font-size:17px;">
        Message and uploaded files
      </h2>

      <div style="background:#FAF9F6;border:1px solid ${BRAND.border};border-radius:12px;padding:18px;">
        ${renderMessageWithDownloadButtons(input.message)}
      </div>

      <div style="margin-top:22px;">
        <a
          href="mailto:${escapeHtml(input.email)}"
          style="
            display:inline-block;
            background:${BRAND.gold};
            color:${BRAND.forest};
            text-decoration:none;
            font-weight:700;
            font-size:14px;
            padding:13px 18px;
            border-radius:8px;
          "
        >
          Reply to ${safeHtml(input.name)}
        </a>
      </div>
    `,
    `New enquiry from ${input.name}`
  );
}

function clientEmailHtml(name: string, isQuote: boolean) {
  const heading = isQuote
    ? "Thanks — we’ve received your quote request"
    : "Thanks for getting in touch";

  const intro = isQuote
    ? "Your quote request is safely with us. We’ll review the details and any files you included, then come back to you with the next steps."
    : "Your message is safely with us. We’ll take the time to review everything carefully and get back to you as soon as possible.";

  return emailShell(
    `
      <h1 style="margin:0 0 16px;color:${BRAND.forest};font-size:25px;line-height:1.3;">
        ${heading}
      </h1>

      <p style="margin:0 0 14px;color:${BRAND.charcoal};font-size:15px;line-height:1.7;">
        Hi ${safeHtml(name)},
      </p>

      <p style="margin:0 0 14px;color:${BRAND.charcoal};font-size:15px;line-height:1.7;">
        ${intro}
      </p>

      <p style="margin:0 0 22px;color:${BRAND.charcoal};font-size:15px;line-height:1.7;">
        We usually reply within 24 hours. If you remember anything else or would like to send us another photo, measurement or detail, just message us directly on WhatsApp.
      </p>

      <div style="margin:0 0 22px;">
        <a
          href="${escapeHtml(WHATSAPP_URL)}"
          target="_blank"
          rel="noopener noreferrer"
          style="
            display:inline-block;
            background:#25D366;
            color:#FFFFFF;
            text-decoration:none;
            font-weight:700;
            font-size:14px;
            padding:13px 20px;
            border-radius:8px;
          "
        >
          Message us on WhatsApp
        </a>
      </div>

      <p style="margin:0;color:${BRAND.charcoal};font-size:15px;line-height:1.7;">
        Warm regards,<br/>
        <strong>Rodrigo and the KiwiKoru 3D team</strong>
      </p>

      <div style="margin-top:24px;text-align:center;">
        <img
          src="${escapeHtml(LOGO_URL)}"
          width="72"
          alt="KiwiKoru 3D"
          style="display:inline-block;width:72px;height:auto;border:0;"
        />
      </div>
    `,
    isQuote
      ? "We’ve received your KiwiKoru 3D quote request."
      : "We’ve received your message and will be in touch soon."
  );
}

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
    html: ownerEmailHtml(input, attachments?.length || 0),
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
    replyTo: TO_EMAIL,
    subject:
      input.subject === "Get a Quote"
        ? "We received your quote request — KiwiKoru 3D"
        : "Thanks for getting in touch — KiwiKoru 3D",
    html: clientEmailHtml(input.name, input.subject === "Get a Quote"),
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

  const ownerEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: TO_EMAIL,
    replyTo: input.email,
    subject: `New quote request from ${input.name}`,
    html: emailShell(
      `
        <h1 style="margin:0 0 20px;color:${BRAND.forest};font-size:24px;">
          New quote request
        </h1>

        <p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;"><strong>Name:</strong> ${safeHtml(input.name)}</p>
        <p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;"><strong>Email:</strong> ${safeHtml(input.email)}</p>
        <p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;"><strong>Phone:</strong> ${safeHtml(input.phone || "-")}</p>
        <p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;"><strong>Quantity:</strong> ${safeHtml(input.quantity || "-")}</p>
        <p style="margin:5px 0;color:${BRAND.charcoal};font-size:14px;"><strong>Material:</strong> ${safeHtml(input.material || "-")}</p>

        <div style="height:1px;background:${BRAND.border};margin:22px 0;"></div>

        <h2 style="margin:0 0 12px;color:${BRAND.charcoal};font-size:17px;">Description</h2>

        <div style="background:#FAF9F6;border:1px solid ${BRAND.border};border-radius:12px;padding:18px;">
          ${renderMessageWithDownloadButtons(input.description)}
        </div>
      `,
      `New quote request from ${input.name}`
    ),
    attachments,
  });

  if (ownerEmail.error) {
    console.error("[EMAIL QUOTE ERROR]", ownerEmail.error);

    return {
      success: false,
      emailSent: false,
      note: ownerEmail.error.message || "Quote email failed.",
    };
  }

  const clientEmail = await resend.emails.send({
    from: FROM_EMAIL,
    to: input.email,
    replyTo: TO_EMAIL,
    subject: "We received your quote request — KiwiKoru 3D",
    html: clientEmailHtml(input.name, true),
  });

  if (clientEmail.error) {
    console.error("[EMAIL QUOTE CLIENT ERROR]", clientEmail.error);
  }

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
