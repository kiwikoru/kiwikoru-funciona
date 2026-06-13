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
      })
    )
    .mutation(async ({ input }) => {
      const resendClient = getResendClient();

      console.log("[ENQUIRY]", {
        to: RESEND_TO,
        from: input.email,
        name: input.name,
        subject: input.subject,
        hasResendApiKey: Boolean(RESEND_API_KEY),
      });

      if (!resendClient) {
        return {
          success: false,
          emailSent: false,
          note: "Email not sent. RESEND_API_KEY is missing in Vercel.",
        };
      }

      try {
        await resendClient.emails.send({
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

              <p><strong>Message:</strong></p>
              <p>${safeHtml(input.message)}</p>
            </div>
          `,
        });

        await resendClient.emails.send({
          from: RESEND_FROM,
          to: input.email,
          subject: "We received your enquiry — Kiwi Koru 3D",
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
              <h2>Thank you for contacting Kiwi Koru 3D</h2>

              <p>Hi ${safeHtml(input.name)},</p>

              <p>Thank you for contacting <strong>Kiwi Koru 3D</strong>.</p>

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

        return {
          success: true,
          emailSent: true,
          message: "Emails sent successfully",
        };
      } catch (err: any) {
        console.error("[EMAIL ERROR]", err?.message || err);

        return {
          success: false,
          emailSent: false,
          note: "Email delivery failed. Check Vercel logs and Resend logs.",
        };
      }
    }),
});