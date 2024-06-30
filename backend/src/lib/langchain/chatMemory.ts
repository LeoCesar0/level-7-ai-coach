import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { chatOpenAI } from "./chatOpenAi";
import { MongooseServer } from "../mongoose";
import { mongoDBClient } from "../mongodb";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
  BaseChatPromptTemplate,
  BasePromptTemplate,
  BasePromptTemplateInput,
} from "@langchain/core/prompts";
import { ConsoleCallbackHandler } from "langchain/callbacks";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";

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

  const chatHistory = new MongoDBChatMessageHistory({
    collection,
    sessionId: chatId,
  });

  const inputKey = "question";
  const memoryKey = "history";

  const memory = new BufferMemory({
    chatHistory: chatHistory,
    returnMessages: true,
    memoryKey: memoryKey,
    inputKey: inputKey,
  });

  //   const chain = new ConversationChain({ llm: chatOpenAI, memory });

  // Create a prompt template with instructions
  //   const promptTemplate = instructions + "\n\n{{conversation}}";
  const knowledge = previousKnowledge.join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", knowledge],
    new MessagesPlaceholder(memoryKey),
    ["human", `{${inputKey}}`],
  ]);

  const chain = prompt
    .pipe(
      new ChatOpenAI({
        model: "gpt-3.5-turbo",
        temperature: 0.8,
        apiKey: process.env.OPENAI_API_KEY,
      })
    )
    .withConfig({
      callbacks: [new ConsoleCallbackHandler()],
    });

  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (sessionId) => chatHistory,
    inputMessagesKey: inputKey,
    historyMessagesKey: memoryKey,
  });

  //   const chain = new ConversationChain({
  //     llm: chatOpenAI,
  //     memory,
  //     prompt: customPrompt,
  //   });

  return {
    chain,
    chainWithHistory,
    memory,
  };
};

// const res1 = await chain.invoke({ input: "Hi! I'm Jim." });
// console.log({ res1 });
// /*
//   {
//     res1: {
//       text: "Hello Jim! It's nice to meet you. My name is AI. How may I assist you today?"
//     }
//   }
//   */

// const res2 = await chain.invoke({ input: "What did I just say my name was?" });
// console.log({ res2 });

// /*
//   {
//     res1: {
//       text: "You said your name was Jim."
//     }
//   }
//   */

// // See the chat history in the MongoDb
// console.log(await memory.chatHistory.getMessages());

// // clear chat history
// await memory.chatHistory.clear();
