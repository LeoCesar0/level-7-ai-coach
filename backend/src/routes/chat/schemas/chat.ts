import mongoose from "mongoose";
import { z } from "zod";
import { zCreateChat } from "./createChat";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zEmbedding } from "../../../@schemas/embeddings";

export const zChatSchema = zCreateChat.merge(zMongoDocument).merge(
  z.object({
    embedding: zEmbedding.optional(),
    messages: z.array(z.string()).optional(),
  })
);

export type IChat = z.infer<typeof zChatSchema>;

const chatSchema = new mongoose.Schema<IChat>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: {
      type: Date,
      required: true,
    },
    messages: {
      type: Array(String),
    },
    embedding: {
      type: Array(Array(Number)),
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
