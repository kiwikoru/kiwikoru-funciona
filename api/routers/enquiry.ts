import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { enquiries } from "@db/schema";

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
      const db = getDb();
      const result = await db.insert(enquiries).values({
        name: input.name,
        company: input.company || null,
        email: input.email,
        phone: input.phone || null,
        subject: input.subject,
        projectType: input.projectType || null,
        message: input.message,
        quoteRef: input.quoteRef || null,
      });
      return { success: true, id: Number(result[0].insertId) };
    }),
});
