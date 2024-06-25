import { z } from "zod";
import { zCreateUser } from "./createUser";

export type ISignUpRoute = z.input<typeof zSignUp>;

export const zSignUp = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 6 characters long" }),
  user: zCreateUser,
});
