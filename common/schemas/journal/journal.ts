import { z } from "zod";
import { zCreateJournal } from "./createJournal";
import { zMongoDocumentClient } from "../mongo";
import { zStringNotEmpty } from "../../../frontend/src/@schemas/primitives";

export const zJournalBase = zCreateJournal.merge(
  z.object({
    assessed: z.boolean().nullish(),
    shouldAssess: z.boolean().nullish(),
  })
);

export const zJournal = zCreateJournal
  .merge(
    z.object({
      user: zStringNotEmpty,
    })
  )
  .merge(zMongoDocumentClient);

export type IJournal = z.infer<typeof zJournal>;
