import { z } from "zod";
import { createRouter, publicQuery } from "./middleware.js";
import { env } from "./lib/env.js";
import { Resend } from "resend";

const resend = env.resendApiKey
  ? new Resend(env.resendApiKey)
  : null;

export const emailRouter = createRouter({
  sendQuote: publicQuery
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Valid email is required"),
        phone: z.string().optional(),
        description: z.string().min(1, "Description is required"),
        quantity: z.string(),
        material: z.string(),
        files: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      if (!resend) {
        return {
          success: true,
          message: "Mock mode",
        };
      }

      await resend.emails.send({
        from: `KiwiKoru 3D <${env.emailFrom}>`,
        to: env.emailTo,
        subject: `New Quote Request from ${input.name}`,
        html: `
          <h2>New Quote Request</h2>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Phone:</strong> ${input.phone || "Not provided"}</p>
          <p><strong>Quantity:</strong> ${input.quantity}</p>
          <p><strong>Material:</strong> ${input.material}</p>
          <hr />
          <p>${input.description.replace(/\n/g, "<br />")}</p>
        `,
      });

      await resend.emails.send({
        from: `KiwiKoru 3D <${env.emailFrom}>`,
        to: input.email,
        subject: "We've Received Your Quote Request",
        html: `
          <h2>Thank you for requesting a quote</h2>
          <p>Hi ${input.name},</p>
          <p>
            We have received your quote request and will respond within 24 hours.
          </p>
          <p>
            Kind regards,<br />
            KiwiKoru 3D
          </p>
        `,
      });

      return {
        success: true,
        message: "Quote request sent successfully",
      };
    }),

  sendContact: publicQuery
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        subject: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (!resend) {
        return {
          success: true,
          message: "Mock mode",
        };
      }

      await resend.emails.send({
        from: `KiwiKoru 3D <${env.emailFrom}>`,
        to: env.emailTo,
        subject: `Contact Form: ${input.subject}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${input.name}</p>
          <p><strong>Email:</strong> ${input.email}</p>
          <p><strong>Subject:</strong> ${input.subject}</p>
          <hr />
          <p>${input.message}</p>
        `,
      });

      await resend.emails.send({
        from: `KiwiKoru 3D <${env.emailFrom}>`,
        to: input.email,
        subject: "We've Received Your Enquiry",
        html: `
          <h2>Thank you for contacting KiwiKoru 3D</h2>
          <p>Hi ${input.name},</p>
          <p>
            We have received your enquiry and will contact you shortly.
          </p>
          <p>
            Kind regards,<br />
            KiwiKoru 3D
          </p>
        `,
      });

      return {
        success: true,
        message: "Message sent successfully",
      };
    }),
});
