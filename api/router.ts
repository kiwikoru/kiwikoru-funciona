import { createRouter, publicQuery } from "./middleware";
import { enquiryRouter } from "./routers/enquiry";
import { emailRouter } from "./routers/email";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  enquiry: enquiryRouter,
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
