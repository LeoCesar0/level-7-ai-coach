import { ChatPromptTemplate, PromptTemplate } from "@langchain/core/prompts";

import { agentTemplate } from "../../lib/langchain/templates";
import { memoryVectorStore } from "../../lib/langchain/memoryVectorStore";
import { chatOpenAI } from "../../lib/langchain/chatOpenAi";
import { getUserRetriever } from "./getUserRetriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { MongoDBChatMessageHistory } from "@langchain/mongodb";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { formatDocumentsAsString } from "langchain/util/document";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { getCollection } from "../mongodb/getCollection";
import { IMemoryMessage } from "../../@schemas/memory";
import {
  HISTORY_COLLECTION,
  MEMORY_COLLECTION,
} from "../../lib/langchain/@static";
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "@langchain/openai";
import { ConversationChain } from "langchain/chains";
import { getChatHistory } from "./getChatHistory";

// https://js.langchain.com/v0.2/docs/integrations/chat_memory/mongodb/

export type IGetChatChainV3 = {
  chatId: string;
  message: string;
  userId: string;
};

export const getChatChainV3 = async ({
  chatId,
  message,
  userId,
}: IGetChatChainV3) => {
  const inputKey = "question";
  const currentHistoryKey = "history";

  const chatHistory = getChatHistory({ chatId });

  const memory = new BufferMemory({
    chatHistory: chatHistory,
  });

  const chain = new ConversationChain({ llm: chatOpenAI, memory });

  return {
    chain,
  };
};

/* 
USAGE


  const { chain, currentHistory } = await getChatChainV2({
        chatId: chatId.toString(),
        userId: userId.toString(),
        message,
      });

      const response = await chain.invoke({
        input: message,
      });

      console.log("❗ response -->", response);

      const aiNow = new Date().toISOString();

      const messages = [message, response.answer];

      const metaData: ICreateMemoryMessage[] = [
        {
          type: "human",
          user_id: userId.toString(),
          chat_id: chatId.toString(),
          created_at: userNow,
        },
        {
          type: "ai",
          user_id: userId.toString(),
          chat_id: chatId.toString(),
          created_at: aiNow,
        },
      ];

      const documents = await createDocuments({
        messages: messages,
        metadatas: metaData,
      });

      await memoryVectorStore.addDocuments(documents);
*/
