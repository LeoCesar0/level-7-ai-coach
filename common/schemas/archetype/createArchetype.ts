import { z } from "zod";
import { zArchetypeBase } from "./archetype";

export type ICreateArchetype = z.input<typeof zCreateArchetype>;

export const zCreateArchetype = zArchetypeBase;
