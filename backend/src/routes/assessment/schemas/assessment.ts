import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zCreateAssessment } from "./createAssessment";
import zodSchema from "@zodyac/zod-mongoose";

export type IAssessment = z.infer<typeof zAssessment>;

export const zAssessment = zCreateAssessment.merge(zMongoDocument);

export const athleteEntry = new Schema<IAssessment>(
  {
    key: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

export const AssessmentModel = model<IAssessment>("User", athleteEntry);
