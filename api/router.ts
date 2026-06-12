import { createRouter, publicQuery } from "./middleware";
import { enquiryRouter } from "./routers/enquiry";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  enquiry: enquiryRouter,
});

export type AppRouter = typeof appRouter;
