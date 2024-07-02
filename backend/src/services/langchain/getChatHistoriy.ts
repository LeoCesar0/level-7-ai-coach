import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { getChatCollection } from "./getChatCollection";

export type IGetChatHistory = {
  chatId: string;
};

export const getChatHistory = ({ chatId }: IGetChatHistory) => {
  const collection = getChatCollection();
  const chatHistory = new MongoDBChatMessageHistory({
    collection,
    sessionId: chatId,
  });
  return chatHistory;
};
