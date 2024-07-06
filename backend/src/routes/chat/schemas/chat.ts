import mongoose from "mongoose";
import { z } from "zod";
import { zCreateChat } from "./createChat";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { zEmbedding } from "../../../@schemas/embeddings";
import { IUser } from "../../users/schemas/user";
import { Timestamp } from "mongodb";

export const zChatSchema = zCreateChat.merge(zMongoDocument);

export type IChat = z.infer<typeof zChatSchema>;

export type IChatFull = Omit<IChat, "user"> & {
  user: IUser;
};

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
