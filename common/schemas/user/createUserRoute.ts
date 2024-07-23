import { z } from "zod";
import { zCreateUser } from "./createUser";

export type ICreateUserRoute = z.input<typeof zCreateUserRoute>;

export const zCreateUserRoute = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
  user: zCreateUser,
});
