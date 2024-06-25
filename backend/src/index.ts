import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users/route";
import dotenv from "dotenv";
import { HTTPException } from "hono/http-exception";
import { AppResponse } from "./@schemas/app";
import { StatusCode } from "hono/utils/http-status";
import { ENV } from "./static/envs";
import { MongooseServer } from "./lib/mongoose";
import organizationsRoute from "./routes/organizations/route";
import { EXCEPTIONS } from "./static/exceptions";

dotenv.config({ path: "../.env" });

const port = Number(process.env.BACKEND_PORT || 8000);

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  console.error("Mongo connection string is not defined");
  process.exit(1);
}

const honoApp = new Hono().basePath("/api").onError(async (err, ctx) => {
  let message = "Unexpected Error";
  let status: StatusCode = 500;

  if (err instanceof HTTPException) {
    const httpError = err.getResponse();
    console.log("Error is HTTPException");
    console.log("httpError.status", httpError.status);
    console.log("httpError.res", httpError);
    status = httpError.status as StatusCode;
    console.log("err.message", err.message);
    if (status === 401) {
      message = EXCEPTIONS.NOT_AUTHORIZED;
    }
    const text = await httpError.text();
    const statusText = httpError.statusText;
    console.log("httpError.statusText", statusText);
    console.log("httpError.text", text);
    console.log("httpError.body", httpError.body);
    ctx.status(status);
  }

  const error: AppResponse = {
    error: {
      message: message,
      _message: err.message || "",
      _isAppError: true,
    },
    data: null,
  };
  return ctx.json(error, status);
});

const routes = honoApp
  .route("/users", userRoute)
  .route("/organizations", organizationsRoute);

export type ApiType = typeof routes;

console.log(`Server is running on port ${port}`);

serve({
  fetch: honoApp.fetch,
  port: port,
});

if (
  process.env.NODE_ENV === ENV.PRODUCTION ||
  process.env.NODE_ENV === ENV.DEVELOPMENT
) {
  MongooseServer.connectServer();
}

export default honoApp;
