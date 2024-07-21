import mongoose from "mongoose";
import { z } from "zod";
import { zCreateJournal } from "./createJournal";
import { zId } from "@zodyac/zod-mongoose";
import { zMongoDocument } from "../mongo";

export const zJournal = zCreateJournal.merge(zMongoDocument).merge(
  z.object({
    user: zId.describe("ObjectId:User"),
    assessed: z.boolean().nullish(),
    shouldAssess: z.boolean().nullish(),
  })
);

export type IJournal = z.infer<typeof zJournal>;
