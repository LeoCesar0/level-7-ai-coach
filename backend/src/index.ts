import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users/route";
import dotenv from "dotenv";
import { ENV } from "./static/envs";
import { MongooseServer } from "./lib/mongoose";
import organizationsRoute from "./routes/organizations/route";
import { handleAppError } from "./handlers/handleAppError";
import { chatRouter } from "./routes/chat/route";
import assessmentRoute from "./routes/assessment/route";
import archetypeRoute from "./routes/archetype/route";
import { playgroundRoute } from "./routes/playground/route";
import cron from "node-cron";
import { journalRoute } from "./routes/journal/route";

dotenv.config({ path: "../.env" });

const port = Number(process.env.BACKEND_PORT || 8000);

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  console.error("❌ Mongo connection string is not defined");
  process.exit(1);
}

const honoApp = new Hono().basePath("/api").onError(handleAppError);

const routes = honoApp
  .route("/users", userRoute)
  .route("/organizations", organizationsRoute)
  .route("/chats", chatRouter)
  .route("/assessments", assessmentRoute)
  .route("/archetypes", archetypeRoute)
  .route("/journals", journalRoute);
// .route("/playground", playgroundRoute);

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

// --------------------------
// SCHEDULES
// --------------------------

if (process.env.NODE_ENV !== ENV.TEST) {
  cron.schedule("*/1 * * * *", () => {
    console.log("Running a task every minute");
  });
}
