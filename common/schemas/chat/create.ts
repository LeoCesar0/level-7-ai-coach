import { z } from "zod";

export const zCreateChat = z.object({
  user: z.string(),
  date: z.date(),
  closed: z.boolean().optional().default(false),
  assessed: z.boolean().optional().default(false),
});

export type ICreateChat = z.infer<typeof zCreateChat>;
