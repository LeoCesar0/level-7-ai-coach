import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import {
  RunnableParallel,
  RunnablePassthrough,
  RunnableSequence,
  RunnableWithMessageHistory,
} from "@langchain/core/runnables";
import { getChatHistory } from "./getChatHistory";
import { agentTemplate } from "../../lib/langchain/templates";
import { getUserRetriever } from "./getUserRetriever";
import { memoryVectorStore } from "../../lib/langchain/memoryVectorStore";
import { CHAT_MODEL, CHAT_TEMPERATURE } from "../../lib/langchain/@static";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { formatDocumentsAsString } from "langchain/util/document";
import { chatOpenAI } from "../../lib/langchain/chatOpenAi";
import { StringOutputParser } from "@langchain/core/output_parsers";

// https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage
// https://js.langchain.com/v0.2/docs/integrations/chat_memory/zep_memory_cloud/#zepcloudchatmessagehistory--runnablewithmessagehistory-usage
// https://js.langchain.com/v0.2/docs/how_to/message_history/#adding-message-history

export type IGetChatChain = {
  chatId: string;
  userId: string;
  message: string;
};

export const getChatChain = async ({
  chatId,
  userId,
  message,
}: IGetChatChain) => {
  const inputKey = "question";
  const currentHistoryKey = "history";

  const chatHistory = getChatHistory({ chatId });

  const prevChatsRetriever = getUserRetriever({
    chatId,
    userId,
    vectorStore: memoryVectorStore,
    type: "prevChats",
  });

  const relevantContext = await prevChatsRetriever._getRelevantDocuments(
    message
  );

  const relevantContextString = formatDocumentsAsString(relevantContext);

  console.log("❗ relevantContextString -->", relevantContextString);

  const prompt = ChatPromptTemplate.fromMessages([
    ["system", agentTemplate],
    ["system", `Previous sessions context: ${relevantContextString}`],
    // [
    //   "assistant",
    //   "Welcome back Fred! How are you feeling today? Is there anything specific you'd like to discuss or focus on in today's session?",
    // ],
    new MessagesPlaceholder(currentHistoryKey),
    ["human", `{${inputKey}}`],
  ]);

  const runnable = prompt.pipe(
    new ChatOpenAI({
      model: CHAT_MODEL,
      temperature: CHAT_TEMPERATURE,
      apiKey: process.env.OPENAI_API_KEY,
    })
  );
  // --------------------------
  // TEST
  // --------------------------

  // const runnable = RunnableSequence.from([
  //   {
  //     context: prevChatsRetriever.pipe(formatDocumentsAsString),
  //     question: new RunnablePassthrough(),
  //   },
  //   prompt,
  //   chatOpenAI,
  //   // new StringOutputParser(),
  // ]);
  // --------------------------
  // TEST 2
  // --------------------------
  // const runnable = RunnableParallel.from({
  //   context: prevChatsRetriever.pipe(formatDocumentsAsString),
  //   question: new RunnablePassthrough(),
  //   prompt: prompt,
  //   model: chatOpenAI,
  // });
  // --------------------------
  //
  // --------------------------

  const chainWithHistory = new RunnableWithMessageHistory({
    runnable: runnable,
    getMessageHistory: (sessionId) => chatHistory,
    inputMessagesKey: inputKey,
    historyMessagesKey: currentHistoryKey,
  });

  return {
    chain: chainWithHistory,
  };
};

/* 
USAGE

  const { chain } = getChatMemory({
        chatId: chat.toString(),
      });

      const resChain = await chain.invoke(
        { question: message },
        {
          configurable: {
            sessionId: chat.toString(),
          },
        }
      );

*/

/*

LUCIO TELL THIS ANME
	"user": "6685f23f3b233334e60c2cad",
	"chat": "6685f2f199abdb87d02d5c44",


  LUCIO HATES APPLE
  "user": "6685f23f3b233334e60c2cad",
	"chat": "6686070425becbe9c209660e",
*/
