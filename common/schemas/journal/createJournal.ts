import { z } from "zod";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";
import { zFlexDate } from "../primitives/zFlexDate";

export const zCreateJournal = z.object({
  title: zStringNotEmpty.default("title"),
  text: z.string().default(""),
  images: z.array(zStringNotEmpty).optional(),
  date: zFlexDate,
  draft: z.boolean().optional(),
});

export type ICreateJournal = z.infer<typeof zCreateJournal>;
