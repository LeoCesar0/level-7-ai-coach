import z from "zod";
import { zCreateArchetype } from "./createArchetype";

export const zUpdateArchetype = zCreateArchetype.partial();

export type IUpdateArchetype = z.infer<typeof zUpdateArchetype>;
