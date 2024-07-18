import type { IChatHistoryMessage } from "./chatHistory";

export type ISendChatMessageResponse = {
  chatClosed: boolean;
  reply: IChatHistoryMessage;
  fullResponse: any;
};
