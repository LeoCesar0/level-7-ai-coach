import mongoose from "mongoose";
import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zJournalBase } from "@common/schemas/journal/journal";
import { zMongoDocument } from "@/@schemas/mongo";

export const zJournalDoc = zJournalBase
  .omit({ date: true })
  .merge(
    z.object({
      user: zId.describe("ObjectId:User"),
      date: z.date(),
    })
  )
  .merge(zMongoDocument);

export type IJournalDoc = z.infer<typeof zJournalDoc>;

const journalSchema = new mongoose.Schema<IJournalDoc>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: { type: String, default: "" },
    text: { type: String, default: "" },
    images: [{ type: String }],
    date: {
      type: Date,
      required: true,
    },
    draft: {
      type: Boolean,
    },
    assessed: {
      type: Boolean,
      default: false,
    },
    shouldAssess: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const JournalModel = mongoose.model<IJournalDoc>(
  "Journal",
  journalSchema
);
