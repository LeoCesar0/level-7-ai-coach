import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zMongoDocument = z.object({
  _id: zId,
  __v: z.number().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IMongoDocument = z.infer<typeof zMongoDocument>


// export type IMongoDocument = {
//   _id: string;
//   __v?: number;
//   createdAt: string;
//   updatedAt: string;
// };
