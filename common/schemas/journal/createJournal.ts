import { z } from "zod";
import { zStringNotEmpty } from "../../../frontend/src/@schemas/primitives";
import { zIsoDate } from "../primitives/isoDate";

export const zCreateJournal = z.object({
  text: z.string().default(""),
  images: z.array(zStringNotEmpty).optional(),
  date: zIsoDate.or(z.date()),
  draft: z.boolean().optional(),
});

export type ICreateJournal = z.infer<typeof zCreateJournal>;
