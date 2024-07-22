import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "@/@schemas/mongo";
import { zCreateAssessment } from "./createAssessement";

export type IAssessmentDoc = z.infer<typeof zAssessmentDoc>;

export const zAssessmentDoc = zCreateAssessment.merge(zMongoDocument);

export const athleteEntry = new Schema<IAssessmentDoc>(
  {
    key: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
    },
    journal: {
      type: Schema.Types.ObjectId,
      ref: "Journal",
    },
    section: {
      type: String,
      required: true,
    },
    justification: {
      type: String,
      required: true,
    },
    value: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

export const AssessmentModel = model<IAssessmentDoc>(
  "Assessment",
  athleteEntry
);
