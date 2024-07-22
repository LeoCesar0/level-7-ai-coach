import { zStringNotEmpty } from "@common/schemas/primitives/stringNotEmpty";
import z from "zod";

export const zSignIn = z.object({
  email: zStringNotEmpty.email(),
  password: zStringNotEmpty,
});

export type ISignIn = z.infer<typeof zSignIn>;
