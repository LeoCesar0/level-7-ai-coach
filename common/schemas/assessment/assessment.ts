import { z } from "zod";
import { zMongoDocumentClient } from "../mongo";
import { zCreateAssessment } from "./createAssessement";

export type IAssessment = z.infer<typeof zAssessment>;

export const zAssessmentBase = zCreateAssessment;

export const zAssessment = zAssessmentBase.merge(zMongoDocumentClient);
