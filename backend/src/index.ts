import { serve } from "@hono/node-server";
import { Hono } from "hono";

const port = Number(process.env.PORT || 8000);

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});
