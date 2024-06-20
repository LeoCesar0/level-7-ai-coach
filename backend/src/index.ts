import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users";

const port = Number(process.env.BACKEND_PORT || 8000);

const honoApp = new Hono().basePath("/api");

const routes = honoApp.route("/users", userRoute);

// app.get("/", (ctx) => {
//   return ctx.text("Hello Hono 2!");
// });

console.log(`Server is running on port ${port}`);

export type ApiType = typeof routes;

serve({
  fetch: honoApp.fetch,
  port: port,
});

export default honoApp;

