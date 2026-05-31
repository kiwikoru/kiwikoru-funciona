import { createRouter, publicQuery } from "./middleware.js";
import { emailRouter } from "./email.js";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  email: emailRouter,
});

export type AppRouter = typeof appRouter;
