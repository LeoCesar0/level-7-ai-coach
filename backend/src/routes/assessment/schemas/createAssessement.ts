import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import {
  zAssessmentBase,
} from "@common/schemas/assessment/assessment";

export type ICreateAssessment = z.infer<typeof zCreateAssessment>;

export const zCreateAssessment = zAssessmentBase
  .omit({
    chat: true,
    user: true,
    journal: true,
    date: true,
  })
  .merge(
    z.object({
      user: zId,
      chat: zId.nullish(),
      journal: zId.nullish(),
      date: z.date(),
    })
  );
