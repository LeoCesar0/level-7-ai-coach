import { z } from "zod";
import { zCreateAssessment } from "../../../backend/src/routes/assessment/schemas/createAssessment";
import { zMongoDocumentClient } from "../mongo";

export type IAssessment = z.infer<typeof zAssessment>;

export const zAssessmentBase = zCreateAssessment;

export const zAssessment = zAssessmentBase.merge(zMongoDocumentClient);
