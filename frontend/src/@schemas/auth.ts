import z from "zod";

export const zSignIn = z.object({
  email: z.string().email(),
  password: z.string(),
});

export type ISignIn = z.infer<typeof zSignIn>;
