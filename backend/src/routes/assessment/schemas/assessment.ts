import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zCreateAssessment } from "./createAssessment";

export type IAssessment = z.infer<typeof zAssessment>;

export const zAssessment = zCreateAssessment.merge(zMongoDocument);

export const athleteEntry = new Schema<IAssessment>(
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
  },
  { timestamps: true }
);

export const AssessmentModel = model<IAssessment>("Assessment", athleteEntry);
