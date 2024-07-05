import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zCreateArchetype } from "./createArchetype";

export type IArchetype = z.infer<typeof zCreateArchetype>;

export const zArchetype = zCreateArchetype.merge(zMongoDocument);

export const archetypeSchema = new Schema<IArchetype>(
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

export const ArchetypeModel = model<IArchetype>("Archetype", archetypeSchema);
