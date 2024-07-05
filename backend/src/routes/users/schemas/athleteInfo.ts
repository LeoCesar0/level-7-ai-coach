import { z } from "zod";
import {
  zAssessmentKey,
  zAssessmentSection,
} from "../../assessment/schemas/enums";

export type IAthleteInfoInput = z.input<typeof zAthleteInfo>;
export type IAthleteInfoOutput = z.output<typeof zAthleteInfo>;

export const zAthleteInfoItem = z.object({
  key: zAssessmentKey,
  section: zAssessmentSection,
  question: z.string(),
  answer: z.string().or(z.number()),
});

export const zAthleteInfo = z.record(zAssessmentKey, zAthleteInfoItem);
