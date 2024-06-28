import { z } from "zod";
import { ROLES_LIST } from "../static/roles";

export const zRole = z.enum(["admin", "user", "coach"]);

export const zChatRole = z.enum(["user", "system", "assistant"]);

export type Role = z.infer<typeof zRole>;

export type ChatRole = z.infer<typeof zChatRole>;
