import mongoose from "mongoose";
import { zChatBase } from "@common/schemas/chat/chat";
import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";

export const zChatDoc = zChatBase
  .omit({
    user: true,
    date: true,
  })
  .merge(
    z.object({
      user: zId.describe("ObjectId:User"),
      date: z.date(),
    })
  );

export type IChatDoc = z.infer<typeof zChatDoc>;

const chatSchema = new mongoose.Schema<IChatDoc>(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    date: {
      type: Date,
      required: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
    assessed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const ChatModel = mongoose.model("Chat", chatSchema);
