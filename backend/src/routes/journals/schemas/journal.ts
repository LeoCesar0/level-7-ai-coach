import mongoose from "mongoose";
import { z } from "zod";
import { zCreateJournal } from "./createJournal";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zId } from "@zodyac/zod-mongoose";

export const zJournal = zCreateJournal.merge(zMongoDocument).merge(
  z.object({
    user: zId.describe("ObjectId:User"),
    assessed: z.boolean().nullish(),
    shouldAssess: z.boolean().nullish(),
  })
);

export type IJournal = z.infer<typeof zJournal>;

const journalSchema = new mongoose.Schema<IJournal>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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

export const JournalModel = mongoose.model("Journal", journalSchema);
