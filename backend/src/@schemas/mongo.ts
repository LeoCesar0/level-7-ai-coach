import { zId } from "@zodyac/zod-mongoose";
import type { ObjectId } from "mongoose";
import { z } from "zod";

export type ModelId = z.infer<typeof zId>;

export type ClientParser<T> = {
  [K in keyof T]: T[K] extends Date
    ? string
    : T[K] extends ObjectId
    ? string
    : T[K] extends ModelId
    ? string
    : T[K] extends object
    ? ClientParser<T[K]>
    : T[K];
};

export const zMongoDocument = z.object({
  _id: zId,
  __v: z.number().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type IMongoDocument = z.infer<typeof zMongoDocument>;
