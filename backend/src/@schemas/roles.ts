import { z } from "zod";
import { ROLES_LIST } from "../static/roles";

export const zRole = z.enum(["admin", "user", "coach"]);

export const zChatRole = z.enum(["user", "system", "assistant"]);

export type IRole = z.infer<typeof zRole>;

export type IChatRole = z.infer<typeof zChatRole>;
