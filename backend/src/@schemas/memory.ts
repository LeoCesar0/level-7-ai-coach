import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";
import { zEmbedding } from "./embeddings";

export const zMessageType = z.enum([
  "function",
  "human",
  "ai",
  "generic",
  "system",
  "tool",
]);

export const zCreateMemoryMessage = z.object({
  user_id: z.string(),
  chat_id: z.string(),
  created_at: z.string(),
  type: zMessageType,
});

export const zMemoryMessage = z.object({
  _id: zId,
  user_id: z.string(),
  chat_id: z.string(),
  created_at: z.string(),
  embedding: zEmbedding.nullish(),
  loc: z.any().nullish(),
  type: zMessageType,
  text: z.string(),
});

export type IMemoryMessage = z.infer<typeof zMemoryMessage>;

export type ICreateMemoryMessage = z.infer<typeof zCreateMemoryMessage>;

// export type IHistoryMessage = {
//   _id: Types.ObjectId;
//   user_id: string;
//   chat_id: string;
//   created_at: string;
//   embedding?: IEmbeddingData;
//   loc?: any;
//   type: MessageType;
//   text: string;
// };
