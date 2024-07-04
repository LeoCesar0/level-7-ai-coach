import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { getCollection } from "../mongodb/getCollection";
import { HISTORY_COLLECTION } from "../../lib/langchain/@static";

export type IGetChatHistory = {
  chatId: string;
};

export const getChatHistory = ({ chatId }: IGetChatHistory) => {
  const collection = getCollection({ name: HISTORY_COLLECTION });
  const chatHistory = new MongoDBChatMessageHistory({
    collection,
    sessionId: chatId,
  });
  return chatHistory;
};
