import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { getChatHistory } from "./getChatHistoriy";

// https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage
// https://js.langchain.com/v0.2/docs/integrations/chat_memory/zep_memory_cloud/#zepcloudchatmessagehistory--runnablewithmessagehistory-usage
// https://js.langchain.com/v0.2/docs/how_to/message_history/#adding-message-history

export type IGetChatMemory = {
  chatId: string;
};

// const previousKnowledge1 = [
//   "You can a coach assistant helping an athlete to get better at their sport",
//   "Be funny and engaging. Help the athlete to overcome any mental and physical barriers",
//   "Ask the athlete about their goals and help them to achieve them",
//   "Be supportive and encouraging",
// ];

const previousKnowledge = [
  "You are a coach assistant helping an athlete to get better at their sport",
  "Help the athlete to overcome any mental and physical barriers",
  "Be objective and answer shortly, but also be funny and excited about the process",
  "Ask the athlete about their goals and help them to achieve them",
  "Be supportive and encouraging",
  "You should try to suggest good habits, workouts and practices along the conversation, to help the athlete achieve their goals",
  "Your second answer of the history should always be about meditation practices. If he seems to intend using meditation practices is a good idea, add some meditation and mindfulness in your suggested practices",
  "Be funny and engaging",
  "Tell jokes when appropriate"
];

export const getChatMemory = ({ chatId }: IGetChatMemory) => {
  const inputKey = "question";
  const memoryKey = "history";

  const chatHistory = getChatHistory({ chatId });

  const memory = new BufferMemory({
    chatHistory: chatHistory,
    returnMessages: true,
    memoryKey: memoryKey,
    inputKey: inputKey,
  });

  const knowledge = previousKnowledge.join("\n");

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", knowledge],
    new MessagesPlaceholder(memoryKey),
    ["human", `{${inputKey}}`],
  ]);

  const chain = prompt.pipe(
    new ChatOpenAI({
      model: "gpt-3.5-turbo",
      temperature: 0.8,
      apiKey: process.env.OPENAI_API_KEY,
    })
  );

  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: chain,
    getMessageHistory: (sessionId) => chatHistory,
    inputMessagesKey: inputKey,
    historyMessagesKey: memoryKey,
  });

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
