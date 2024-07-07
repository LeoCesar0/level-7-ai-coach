import mongoose from "mongoose";
import { z } from "zod";
import { zCreateChat } from "./createChat";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { IUser } from "../../users/schemas/user";

export const zChatSchema = zCreateChat.merge(zMongoDocument).merge(
  z.object({
    closed: z.boolean().optional(),
    assessed: z.boolean().optional(),
  })
);

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
    closed: {
      type: Boolean,
    },
    assessed: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
