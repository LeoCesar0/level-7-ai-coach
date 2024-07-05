import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zMongoDocument = z.object({
  _id: zId,
  __v: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IMongoDocument = {
  _id: string;
  __v?: number;
  createdAt: string;
  updatedAt: string;
};
