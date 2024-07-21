import mongoose from "mongoose";
import { type IChatDoc } from "@common/schemas/chat/chat";

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
