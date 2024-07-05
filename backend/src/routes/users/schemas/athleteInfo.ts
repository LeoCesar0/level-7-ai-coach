import { z } from "zod";
import {
  zAssessmentKey,
  zAssessmentSection,
} from "../../assessment/schemas/enums";

export type IAthleteInfo = z.output<typeof zAthleteInfo>;

export const zAthleteInfoItem = z.object({
  section: zAssessmentSection,
  question: z.string(),
  answer: z.string().or(z.number()),
});

export const zAthleteInfo = z.record(zAssessmentKey, zAthleteInfoItem);
