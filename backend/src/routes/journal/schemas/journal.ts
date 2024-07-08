import mongoose from "mongoose";
import { z } from "zod";
import { zCreateJournal } from "./createJournal";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zId } from "@zodyac/zod-mongoose";

export const zJournalSchema = zCreateJournal
  .merge(zMongoDocument)
  .omit({ date: true })
  .merge(
    z.object({ date: z.date().optional(), user: zId.describe("ObjectId:User") })
  );

export type IJournal = z.infer<typeof zJournalSchema>;

const journalSchema = new mongoose.Schema<IJournal>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: { type: String, default: "" },
    images: [{ type: String }],
    date: {
      type: Date,
      default: Date.now,
    },
    draft: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const JournalModel = mongoose.model("Journal", journalSchema);
