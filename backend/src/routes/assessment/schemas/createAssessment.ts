import { z } from "zod";
import { zAthleteInfoItem } from "../../users/schemas/athleteInfo";
import { zId } from "@zodyac/zod-mongoose";
import { zAssessmentKey } from "./enums";

export type ICreateAssessment = z.infer<typeof zCreateAssessment>;

export const zCreateAssessmentAIAnswer = z.object({
  key: zAssessmentKey,
  value: z
    .number()
    .min(1)
    .max(10)
    .describe("Describe the athlete's progress from 1 to 10 in the topic"),
  justification: z.string().describe("Justify the current assessment value"),
});

export const zAssessmentAIResponse = zAthleteInfoItem
  .omit({ answer: true, question: true })
  .merge(zCreateAssessmentAIAnswer);

export const zCreateAssessment = zAssessmentAIResponse.merge(
  z.object({
    user: zId,
    chat: zId.optional(),
    journal: zId.optional(),
  })
);

export const zCreateAssessmentRoute = z.object({
  user: zId,
  entries: z.array(zCreateAssessment),
});