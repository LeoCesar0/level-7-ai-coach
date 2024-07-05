import { z } from "zod";
import { zAthleteInfoItem } from "../../users/schemas/athleteInfo";
import { zId } from "@zodyac/zod-mongoose";
import { zAssessmentKey } from "./enums";

export type ICreateAssessment = z.infer<typeof zCreateAssessment>;

export const zCreateAssessmentAIAnswer = z.object({
  key: zAssessmentKey,
  value: z.number().min(1).max(10),
  justification: z.string(),
});

export const zCreateAssessment = zAthleteInfoItem
  .omit({ answer: true, question: true })
  .merge(zCreateAssessmentAIAnswer)
  .merge(
    z.object({
      userId: zId,
    })
  );

export const zCreateAssessmentRoute = z.object({
  userId: zId,
  entries: z.array(zCreateAssessment),
});
