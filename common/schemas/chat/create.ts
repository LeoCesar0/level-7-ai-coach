import { z } from "zod";
import { zIsoDate } from "../primitives/isoDate";

export const zCreateChat = z.object({
  user: z.string(),
  date: zIsoDate,
  closed: z.boolean().optional().default(false),
  assessed: z.boolean().optional().default(false),
});

export type ICreateChat = z.input<typeof zCreateChat>;
