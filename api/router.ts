import { createRouter, publicQuery } from "./middleware.js";
import { enquiryRouter } from "./routers/enquiry.js";
import { emailRouter } from "./routers/email.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  enquiry: enquiryRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;