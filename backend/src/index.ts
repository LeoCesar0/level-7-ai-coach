import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users/route";
import dotenv from "dotenv";
import { ENV } from "./static/envs";
import { MongooseServer } from "./lib/mongoose";
import organizationsRoute from "./routes/organizations/route";
import { onAppError } from "./handlers/onAppError";
import { chatRouter } from "./routes/chat/route";

dotenv.config({ path: "../.env" });

const port = Number(process.env.BACKEND_PORT || 8000);

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  console.error("❌ Mongo connection string is not defined");
  process.exit(1);
}

const honoApp = new Hono().basePath("/api").onError(onAppError);

const routes = honoApp
  .route("/users", userRoute)
  .route("/organizations", organizationsRoute)
  .route("/chat", chatRouter);

export type ApiType = typeof routes;

export const honoServer = serve({
  fetch: honoApp.fetch,
  port: port,
});

honoServer.on("listening", () => {
  console.log(`🚀 Server is running on port ${port}`);
});

if (
  process.env.NODE_ENV === ENV.PRODUCTION ||
  process.env.NODE_ENV === ENV.DEVELOPMENT
) {
  MongooseServer.connectServer();
}

export default honoApp;
