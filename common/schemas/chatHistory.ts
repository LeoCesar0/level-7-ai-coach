export type IMessageType =
  | "function"
  | "human"
  | "ai"
  | "generic"
  | "system"
  | "tool";

export type IChatHistoryMessage = {
  chat: string;
  message: string;
  role: IMessageType;
};
