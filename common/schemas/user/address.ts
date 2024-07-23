import { z } from "zod";

export const zAddress = z.object({
  city: z.string().optional().default(""),
  state: z.string().optional().default(""),
  country: z.string().optional().default(""),
  address: z.string().optional().default(""),
});

export type IAddress = z.infer<typeof zAddress>;
