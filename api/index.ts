import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router.js";
import { createContext } from "./context.js";

const app = new Hono();

app.use("/api/*", bodyLimit({ maxSize: 50 * 1024 * 1024 }));

app.get("/api/health", (c) => {
  return c.json({ ok: true, env: "vercel" });
});

app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});

app.all("/api/*", (c) => {
  return c.json({ error: "Not Found" }, 404);
});

export default app;