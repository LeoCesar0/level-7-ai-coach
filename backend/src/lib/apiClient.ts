import { hc } from "hono/client";
import { ApiType } from "..";

export const apiClient = hc<ApiType>("http://localhost:8000");
