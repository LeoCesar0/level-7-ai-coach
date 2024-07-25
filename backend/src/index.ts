import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users/route";
import dotenv from "dotenv";
import { ENV } from "@common/static/envs";
import { MongooseServer } from "./lib/mongoose";
import organizationsRoute from "./routes/organizations/route";
import { handleAppError } from "./handlers/handleAppError";
import { chatRouter } from "./routes/chat/route";
import assessmentRoute from "./routes/assessment/route";
import archetypeRoute from "./routes/archetype/route";
import { playgroundRoute } from "./routes/playground/route";
import cron from "node-cron";
import { journalRoute } from "./routes/journals/route";
import { processUserAnalytics } from "./services/analytics/processUserAnalytics";
import { processJournalsAssessment } from "./services/assessment/processJournalsAssessment";
import { cors } from "hono/cors";
import testRoute from "./routes/test/route";

dotenv.config({ path: "../.env" });

const port = Number(process.env.BACKEND_PORT || 8000);

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  console.error("❌ Mongo connection string is not defined");
  process.exit(1);
}

const honoApp = new Hono().basePath("/api").onError(handleAppError);

honoApp.use(
  "/*",
  cors({
    origin: "*",
    // allowHeaders: ["Content-Type", "Authorization"],
    // allowMethods: ["GET", "POST", "PUT", "DELETE"],
  })
);

honoApp.use("*", async (ctx, next) => {
  if (process.env.NODE_ENV === ENV.PRODUCTION) {
    return await next();
  }

  const req = ctx.req;
  const url = req.url;
  const method = req.method;
  console.log("-----------------------------------");
  console.log("Requested Path:", url);
  try {
    const payload = method === "GET" ? req.query() : await req.json();
    console.log("Payload:", payload);
  } catch (err) {}

  await next();

  try {
    const response = await ctx.res.json();
    console.log("Response: ", response);
  } catch (err) {}
});

const routes = honoApp
  .route("/users", userRoute)
  .route("/organizations", organizationsRoute)
  .route("/chats", chatRouter)
  .route("/assessments", assessmentRoute)
  .route("/archetypes", archetypeRoute)
  .route("/journals", journalRoute)
  .route("/playground", playgroundRoute)
  .route("/test", testRoute);

export type ApiType = typeof routes;

export const honoServer = serve({
  fetch: honoApp.fetch,
  port: port,
});

honoServer.on("listening", () => {
  console.log(
    `🚀 Server is running on port ${port}, env: ${process.env.NODE_ENV}`
  );
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
  ("0 3 * * *"); // Every day at 3 am
  ("*/1 * * * *"); // Every 1 min
  ("*/30 * * * * *"); // Every 30 sec
  cron.schedule("0 3 * * *", () => {
    console.log("Running a task every minute");
    processJournalsAssessment();

    processUserAnalytics();
  });
}
