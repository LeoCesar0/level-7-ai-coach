import { serve } from "@hono/node-server";
import { Hono } from "hono";
import userRoute from "./routes/users";
import dotenv from "dotenv";
import mongoose from "mongoose";
import { HTTPException } from "hono/http-exception";
import { AppResponse } from "./@schemas/app";
import { StatusCode } from "hono/utils/http-status";

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

// app.get("/", (ctx) => {
//   return ctx.text("Hello Hono 2!");
// });

console.log(`Server is running on port ${port}`);

export type ApiType = typeof routes;

serve({
  fetch: honoApp.fetch,
  port: port,
});

mongoose
  .connect(process.env.MONGO_DB_CONNECTION_STRING!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err.message);
  });

export default honoApp;
