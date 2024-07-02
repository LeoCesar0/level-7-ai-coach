import { BufferMemory } from "langchain/memory";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { getChatHistory } from "./getChatHistoriy";
import { agentTemplate } from "../../lib/langchain/templates";

// https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage
// https://js.langchain.com/v0.2/docs/integrations/chat_memory/zep_memory_cloud/#zepcloudchatmessagehistory--runnablewithmessagehistory-usage
// https://js.langchain.com/v0.2/docs/how_to/message_history/#adding-message-history

export type IGetChatMemory = {
  chatId: string;
};

export const getChatMemory = ({ chatId }: IGetChatMemory) => {
  console.log("❗ getChatMemory");

  const inputKey = "question";
  const currentHistoryKey = "currentHistory";

  const chatHistory = getChatHistory({ chatId });

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", agentTemplate],
    [
      "assistant",
      "Welcome back Fred! How are you feeling today? Is there anything specific you'd like to discuss or focus on in today's session?",
    ],
    new MessagesPlaceholder(currentHistoryKey),
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
    historyMessagesKey: currentHistoryKey,
  });

  return {
    chain,
    chainWithHistory,
  };
};

/* 
USAGE

  const { chain, chainWithHistory, memory } = getChatMemory({
        chatId: chat.toString(),
      });

      const resChain = await chainWithHistory.invoke(
        { question: message },
        {
          configurable: {
            sessionId: chat.toString(),
          },
        }
      );


*/
