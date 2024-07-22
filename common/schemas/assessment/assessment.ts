import { z } from "zod";
import { zMongoDocumentClient } from "../mongo";
import { zAthleteInfoItem } from "../user/athleteInfo";
import { zAssessmentKey } from "./enums";
import { zIsoDate } from "../primitives/isoDate";

export type IAssessment = z.infer<typeof zAssessment>;

export type IAssessmentAIResponse = z.infer<typeof zAssessmentAIResponse>;

export const zAssessmentAIResponse = zAthleteInfoItem
  .omit({ answer: true, question: true })
  .merge(
    z.object({
      key: zAssessmentKey,
      value: z
        .number()
        .min(1)
        .max(10)
        .describe("Describe the athlete's progress from 1 to 10 in the topic"),
      justification: z
        .string()
        .describe("Justify the current assessment value"),
    })
  );

export const zAssessmentBase = zAssessmentAIResponse.merge(
  z.object({
    user: z.string(),
    chat: z.string().nullish(),
    journal: z.string().nullish(),
    date: zIsoDate,
  })
);

export const zAssessment = zAssessmentBase.merge(zMongoDocumentClient);
