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

const previousKnowledge = [
  "You can a coach assistant helping an athlete to get better at their sport",
  "Be funny and engaging. Help the athlete to overcome any mental and physical barriers",
  "Ask the athlete about their goals and help them to achieve them",
  "Be supportive and encouraging",
];

export const getChatMemory = ({ chatId }: IGetChatMemory) => {
  const dbName = MongooseServer.dbName;

  //   const collection = client.db(dbName).collection("memory");
  const collection = mongoDBClient.db(dbName).collection("memory");

  const memory = new BufferMemory({
    chatHistory: new MongoDBChatMessageHistory({
      collection,
      sessionId: chatId,
    }),
    returnMessages: true,
    // memoryKey: "history",
  });

  const knowledge = previousKnowledge.join("\n");

  const chain = new ConversationChain({
    llm: chatOpenAI,
    memory,
  });

  return {
    chain,
    memory,
  };
};
