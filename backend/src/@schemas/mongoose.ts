import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zMongoDocument = z.object({
  _id: zId,
  __v: z.number().optional(),
});

export type MongoDocument = {
  _id: string;
  __v: number;
};
