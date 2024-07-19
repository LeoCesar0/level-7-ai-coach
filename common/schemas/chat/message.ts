import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";
import { ClientParser } from "../mongo";

export const zMessageType = z.enum([
  "function",
  "human",
  "ai",
  "generic",
  "system",
  "tool",
]);
export type IMessageType = z.infer<typeof zMessageType>;

export type IFormattedMessage = {
  chat: string;
  message: string;
  role: IMessageType;
};

