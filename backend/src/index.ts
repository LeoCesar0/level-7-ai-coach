import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users";
import dotenv from "dotenv";
import { HTTPException } from "hono/http-exception";
import { AppResponse } from "./@schemas/app";
import { StatusCode } from "hono/utils/http-status";
import { ENV } from "./static/envs";
import { MongooseServer } from "./lib/mongoose";

dotenv.config({ path: "../.env" });

const port = Number(process.env.BACKEND_PORT || 8000);

if (!process.env.MONGO_DB_CONNECTION_STRING) {
  console.error("MONGO_DB_CONNECTION_STRING is not defined");
  process.exit(1);
}

const honoApp = new Hono().basePath("/api").onError((err, ctx) => {
  console.log("ON ERROR");
  if (err instanceof HTTPException) {
    console.log("Error is HTTPException");
    // Get the custom response
    const httpError = err.getResponse();
    console.log("errorResponse", httpError);
    // return errorResponse;
    ctx.status(httpError.status as StatusCode);
  }

  const error: AppResponse = {
    error: {
      message: "Unexpected Error",
      _message: err.message || "",
      _isAppError: true,
    },
    data: null,
  };
  return ctx.json(error);
});

const routes = honoApp.route("/users", userRoute);

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
