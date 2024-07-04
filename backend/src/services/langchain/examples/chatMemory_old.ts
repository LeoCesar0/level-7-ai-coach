import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import { chatOpenAI } from "./chatOpenAi";
import { MongooseServer } from "../mongoose";
import { mongoDBClient } from "../mongodb";

// EXAMPLE: https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage

export type IGetChatMemory = {
  chatId: string;
};

export const getChatMemoryFromBuffer = ({ chatId }: IGetChatMemory) => {
  const dbName = MongooseServer.dbName;

  //   const collection = client.db(dbName).collection("memory");
  const collection = mongoDBClient.db(dbName).collection("memory");

//   const memory = new BufferMemory({
//     chatHistory: new MongoDBChatMessageHistory({
//       collection,
//       sessionId: chatId,
//     }),
//     returnMessages: true,
//     // memoryKey: "history",
//   });

//   const chain = new ConversationChain({
//     llm: chatOpenAI,
//     memory,
//   });

  return {
    chain,
    memory,
  };
};
