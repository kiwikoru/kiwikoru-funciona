import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";
import { Resend } from "resend";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM =
  process.env.RESEND_FROM || "Kiwi Koru 3D <no-reply@kiwikoru.co.nz>";
const RESEND_TO = process.env.RESEND_TO || "kiwikoru3d@gmail.com";

function getResendClient() {
  if (!RESEND_API_KEY) {
    console.error("[EMAIL] Missing RESEND_API_KEY");
    return null;
  }

  return new Resend(RESEND_API_KEY);
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

  const attachments = files
    .filter((file) => file.content && file.content.length > 0)
    .map((file) => ({
      filename: file.name,
      content: cleanBase64(file.content),
    }));

  return attachments.length > 0 ? attachments : undefined;
}

export const emailRouter = createRouter({
  send: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        email: z.string().email(),
        subject: z.string().min(1),
        message: z.string().min(1),
        company: z.string().optional(),
        phone: z.string().optional(),
        projectType: z.string().optional(),
        quoteRef: z.string().optional(),
        files: z
          .array(
            z.object({
              name: z.string(),
              type: z.string().optional(),
              content: z.string(),
            })
          )
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const resendClient = getResendClient();
      const attachments = createAttachments(input.files);

      console.log("[ENQUIRY]", {
        to: RESEND_TO,
        from: input.email,
        name: input.name,
        subject: input.subject,
        hasResendApiKey: Boolean(RESEND_API_KEY),
        filesCount: input.files?.length || 0,
        fileNames: input.files?.map((file) => file.name) || [],
        attachmentsCount: attachments?.length || 0,
      });

      if (!resendClient) {
        return {
          success: false,
          emailSent: false,
          note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
        };
      }

      try {
        const ownerEmail = await resendClient.emails.send({
          from: RESEND_FROM,
          to: RESEND_TO,
          replyTo: input.email,
          subject: `[KiwiKoru] ${input.subject} — ${input.name}`,
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
              <h2>New Enquiry — Kiwi Koru 3D</h2>

              <p><strong>Name:</strong> ${safeHtml(input.name)}</p>
              <p><strong>Email:</strong> ${safeHtml(input.email)}</p>
              ${
                input.company
                  ? `<p><strong>Company:</strong> ${safeHtml(input.company)}</p>`
                  : ""
              }
              ${
                input.phone
                  ? `<p><strong>Phone:</strong> ${safeHtml(input.phone)}</p>`
                  : ""
              }
              <p><strong>Subject:</strong> ${safeHtml(input.subject)}</p>
              ${
                input.projectType
                  ? `<p><strong>Project:</strong> ${safeHtml(input.projectType)}</p>`
                  : ""
              }
              ${
                input.quoteRef
                  ? `<p><strong>Quote reference:</strong> ${safeHtml(input.quoteRef)}</p>`
                  : ""
              }

              <hr />

              <p><strong>Attachments received:</strong> ${attachments?.length || 0}</p>
              <p><strong>Attachment names:</strong> ${safeHtml(
                input.files?.map((file) => file.name).join(", ") || "-"
              )}</p>

              <hr />

              <p><strong>Message:</strong></p>
              <p>${safeHtml(input.message)}</p>
            </div>
          `,
          attachments,
        });

        if (ownerEmail.error) {
          console.error("[EMAIL OWNER ERROR]", ownerEmail.error);

          return {
            success: false,
            emailSent: false,
            note: ownerEmail.error.message || "Owner email failed.",
          };
        }

        const clie