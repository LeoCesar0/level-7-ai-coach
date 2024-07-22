import { z } from "zod";

export const zMongoDocumentClient = z.object({
  _id: z.string(),
  __v: z.number().nullish(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type IMongoDocumentClient = z.infer<typeof zMongoDocumentClient>;
