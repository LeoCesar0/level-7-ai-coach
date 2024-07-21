import { z } from "zod";

export const zAddress = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string(),
  address: z.string(),
});

export type IAddress = z.infer<typeof zAddress>;
