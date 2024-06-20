import { serve } from "@hono/node-server";
import { Hono } from "hono";

const port = Number(process.env.BACKEND_PORT || 8000);

const app = new Hono().basePath("/api");

app.get("/", (ctx) => {
  return ctx.text("Hello Hono 2!");
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});
