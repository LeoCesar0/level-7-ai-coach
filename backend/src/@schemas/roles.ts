import { z } from "zod";

export const zRole = z.enum(["admin", "user", "coach"]);

export type IRole = z.infer<typeof zRole>;
