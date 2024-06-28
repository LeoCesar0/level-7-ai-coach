import mongoose from "mongoose";
import { z } from "zod";
import { zCreateChat } from "./createChat";
import { zMongoDocument } from "../../../@schemas/mongoose";

export const zChatSchema = zCreateChat.merge(zMongoDocument)

export type IChat = z.infer<typeof zChatSchema>;

const chatSchema = new mongoose.Schema<IChat>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
