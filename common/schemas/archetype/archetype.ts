import { Schema, model } from "mongoose";
import { z } from "zod";
import { zCreateArchetype } from "./createArchetype";
import { zMongoDocumentClient } from "../mongo";

export type IArchetype = z.infer<typeof zArchetype>;

export const zArchetypeBase = zCreateArchetype;

export const zArchetype = zCreateArchetype.merge(zMongoDocumentClient);
