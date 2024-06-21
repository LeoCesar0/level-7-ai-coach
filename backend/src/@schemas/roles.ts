import { z } from "zod";
import { ROLES_LIST } from "../static/roles";

export const zRole = z.enum(["admin", "user", "coach"]);

export type Role = z.infer<typeof zRole>;