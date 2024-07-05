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
import { HISTORY_COLLECTION } from "../../lib/langchain/@static";

// https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage
// https://js.langchain.com/v0.2/docs/integrations/chat_memory/zep_memory_cloud/#zepcloudchatmessagehistory--runnablewithmessagehistory-usage
// https://js.langchain.com/v0.2/docs/how_to/message_history/#adding-message-history

export type IGetChatChainV2 = {
  chatId: string;
  message: string;
  userId: string;
};

export const getChatChainV2 = async ({
  chatId,
  message,
  userId,
}: IGetChatChainV2) => {

  const inputKey = "input";
  const currentHistoryKey = "chat_history";

  const prevChatsRetriever = getUserRetriever({
    chatId,
    userId,
    vectorStore: memoryVectorStore,
    type: "prevChats",
  });

  const collection = getCollection({ name: HISTORY_COLLECTION });

  const currentMessages: IMemoryMessage[] = (await collection
    .find(
      {
        chat_id: chatId,
      },
      {
        projection: {
          embedding: false,
        },
      }
    )
    .sort({ created_at: -1 })
    .limit(10)
    .toArray()) as IMemoryMessage[];

  const currentHistory = currentMessages.map((item) => {
    return `${item.type} at ${item.created_at}: ${item.text}`;
  });


  // const prevSessionsRetriever = getUserRetriever({
  //   chatId,
  //   userId,
  //   vectorStore: historyVectorStore,
  //   type: "prevChats",
  // });

  // const currentSessionsRetriever = getUserRetriever({
  //   chatId,
  //   userId,
  //   vectorStore: historyVectorStore,
  //   type: "currentChat",
  // });

  // --------------------------
  // test
  // --------------------------

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", agentTemplate],
    ["system", `Relevant context from previous sessions: {context}`],
    [
      "system",
      `You should follow the current session history of the chat, making sure to follow a linear and humanized conversation, always keeping in my the previous sessions when necessary`,
    ],
    ["system", `Current session history: ${currentHistory.join("\n")}`],
    ["human", `{${inputKey}}`],
  ]);

  const combineDocsChain = await createStuffDocumentsChain({
    llm: chatOpenAI,
    prompt: prompt,
  });

  const chain = await createRetrievalChain({
    retriever: prevChatsRetriever,
    combineDocsChain,
  });

  // --------------------------
  //
  // --------------------------
  // const prompt = PromptTemplate.fromTemplate(`"system": ${agentTemplate}
  // "system": Relevant context from previous sessions: {context}
  // "system": You should follow the current session history of the chat, making sure to follow a linear and humanized conversation, always keeping in my the previous sessions when necessary
  // "system": Current session history: ${currentHistory.join("\n")}
  // "human": {input}`);

  // const chain = RunnableSequence.from([
  //   {
  //     context: prevChatsRetriever.pipe(formatDocumentsAsString),
  //     input: new RunnablePassthrough(),
  //   },
  //   prompt,
  //   chatOpenAI,
  //   new StringOutputParser(),
  // ]);

  return {
    chain,
    currentHistory,
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
