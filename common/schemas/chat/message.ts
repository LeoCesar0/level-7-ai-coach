import { z } from "zod";

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
