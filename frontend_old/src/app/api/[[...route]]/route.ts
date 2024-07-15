import { Hono } from "hono";
import { handle } from "hono/vercel";

import authRoutes from "./auth";
import { handleAppError } from "@/handlers/handleAppError";

export const runtime = "edge";

const app = new Hono().basePath("/api").onError(handleAppError);

const routes = app.route("/auth", authRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);

export type ApiType = typeof routes;
