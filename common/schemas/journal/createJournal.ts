import { z } from "zod";
import { zIsoDate } from "../primitives/isoDate";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";

export const zCreateJournal = z.object({
  text: z.string().default(""),
  images: z.array(zStringNotEmpty).optional(),
  date: zIsoDate,
  draft: z.boolean().optional(),
});

export type ICreateJournal = z.infer<typeof zCreateJournal>;
