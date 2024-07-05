import { z } from "zod";

export type ICreateArchetype = z.infer<typeof zCreateArchetype>;

export const zCreateArchetype = z.object({
  name: z.string(),
  slug: z.string().optional(),
  description: z.string(),
});



