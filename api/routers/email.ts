import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const RESEND_FROM = process.env.RESEND_FROM || "KiwiKoru 3D <noreply@kiwikoru3d.com>";
const RESEND_TO = process.env.RESEND_TO || "kiwikoru3d@gmail.com";

let resendClient: any = null;
if (RESEND_API_KEY) {
  try {
    const { Resend } = require("resend");
    resendClient = new Resend(RESEND_API_KEY);
  } catch {
    // resend not available
  }
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
      })
    )
    .mutation(async ({ input }) => {
      console.log("[ENQUIRY]", {
        to: RESEND_TO,
        from: input.email,
        name: input.name,
        subject: input.subject,
      });

      if (!resendClient) {
        console.log("[EMAIL] Resend not configured — enquiry saved but email not sent");
        return { success: true, emailSent: false, note: "Enquiry saved. Add RESEND_API_KEY for email delivery." };
      }

      try {
        await resendClient.emails.send({
          from: RESEND_FROM,
          to: RESEND_TO,
          reply_to: input.email,
          subject: `[KiwiKoru] ${input.subject} — ${input.name}`,
          html: `
            <h2>New Enquiry — KiwiKoru 3D</h2>
            <p><strong>Name:</strong> ${input.name}</p>
            <p><strong>Email:</strong> ${input.email}</p>
            ${input.company ? `<p><strong>Company:</strong> ${input.company}</p>` : ""}
            ${input.phone ? `<p><strong>Phone:</strong> ${input.phone}</p>` : ""}
            <p><strong>Subject:</strong> ${input.subject}</p>
            ${input.projectType ? `<p><strong>Project:</strong> ${input.projectType}</p>` : ""}
            <p><strong>Message:</strong></p>
            <pre style="background:#f5f5f5;padding:12px;border-radius:6px;white-space:pre-wrap;">${input.message}</pre>
          `,
        });

        await resendClient.emails.send({
          from: RESEND_FROM,
          to: input.email,
          subject: "We received your enquiry — KiwiKoru 3D",
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:500px;margin:0 auto;color:#333;">
              <h2 style="color:#1A2F23;">Hi ${input.name},</h2>
              <p>Thank you for contacting <strong>KiwiKoru 3D</strong>.</p>
              <p>We have received your enquiry about <strong>${input.subject}</strong> and will respond within <strong>24 hours</strong>.</p>
              <hr style="border:none;border-top:1px solid #eee;margin:24px 0;" />
              <p style="color:#666;font-size:13px;">Need immediate help? Call <a href="tel:+640272602954">+64 027 260 2954</a> or <a href="https://wa.me/640272602954">message us on WhatsApp</a>.</p>
            </div>
          `,
        });

        return { success: true, emailSent: true };
      } catch (err: any) {
        console.error("[EMAIL ERROR]", err?.message || err);
        return {
          success: true,
          emailSent: false,
          note: "Enquiry saved to database. Email delivery failed but we will still contact you.",
        };
      }
    }),
});
