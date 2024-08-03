import { z } from "zod";
import { zJournalBase } from "./journal";

export const zUpdateJournal = zJournalBase.partial();

export type IUpdateJournal = z.infer<typeof zUpdateJournal>;
