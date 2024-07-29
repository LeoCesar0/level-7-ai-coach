import { z } from "zod";
import { zMongoDocumentClient } from "../mongo";

export type IArchetype = z.infer<typeof zArchetype>;

export const zArchetypeBase = z.object({
  name: z.string(),
  slug: z.string().optional(),
  description: z.string(),
});

export const zArchetype = zArchetypeBase.merge(zMongoDocumentClient);
