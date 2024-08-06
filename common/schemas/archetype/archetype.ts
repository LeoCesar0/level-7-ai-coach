import { z } from "zod";
import { zMongoDocumentClient } from "../mongo";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";

export type IArchetype = z.infer<typeof zArchetype>;

export const zArchetypeBase = z.object({
  name: zStringNotEmpty,
  slug: z.string().optional(),
  description: zStringNotEmpty,
});

export const zArchetype = zArchetypeBase.merge(zMongoDocumentClient);
