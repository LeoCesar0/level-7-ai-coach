import { zArchetypeBase } from "@common/schemas/archetype/archetype";
import { zMongoDocument } from "@common/schemas/mongo";
import { Schema, model } from "mongoose";
import { z } from "zod";

export type IArchetypeDoc = z.infer<typeof zArchetypeDoc>;

export const zArchetypeDoc = zArchetypeBase.merge(zMongoDocument);

export const archetypeSchema = new Schema<IArchetypeDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const ArchetypeModel = model<IArchetypeDoc>(
  "Archetype",
  archetypeSchema
);
