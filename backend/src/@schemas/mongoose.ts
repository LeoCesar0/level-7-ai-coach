import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zMongooseBase = z.object({ _id: zId, __v: z.number().optional() });
