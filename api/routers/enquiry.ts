import { z } from "zod";
import { createRouter, publicQuery } from "../middleware.js";

export const enquiryRouter = createRouter({
  create: publicQuery
    .input(
      z.object({
        name: z.string().min(1),
        company: z.string().optional(),
        email: z.string().email(),
        phone: z.string().optional(),
        subject: z.string().min(1),
        projectType: z.string().optional(),
        message: z.string().min(1),
        quoteRef: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      console.log("Enquiry received:", {
        name: input.name,
        email: input.email,
        subject: input.subject,
      });

      return { success: true, id: Date.now() };
    }),
});