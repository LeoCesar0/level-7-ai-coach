import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";
import { zStringNotEmpty } from "../../../@schemas/primitives/stringNotEmpty";
import { zIsoDate } from "../../../@schemas/primitives/isoDate";

export const zCreateJournal = z.object({
  text: z.string().default(""),
  images: z.array(zStringNotEmpty).optional(),
  date: zIsoDate.optional(),
  draft: z.boolean().optional(),
});

export type ICreateJournal = z.infer<typeof zCreateJournal>;
