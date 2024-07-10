import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { RunnableWithMessageHistory } from "@langchain/core/runnables";
import { getChatHistory } from "./getChatHistory";
import { agentTemplate } from "../../lib/langchain/templates";
import { getUserRetriever } from "./getUserRetriever";
import { memoryVectorStore } from "../../lib/langchain/memoryVectorStore";
import { CHAT_MODEL, CHAT_TEMPERATURE } from "../../lib/langchain/@static";
import { formatDocumentsAsString } from "langchain/util/document";
import { ChatTemplateInput } from "../../@schemas/langchain";
import { IUserFull } from "../../routes/users/schemas/user";

// https://js.langchain.com/v0.1/docs/integrations/chat_memory/mongodb/#usage
// https://js.langchain.com/v0.2/docs/integrations/chat_memory/zep_memory_cloud/#zepcloudchatmessagehistory--runnablewithmessagehistory-usage
// https://js.langchain.com/v0.2/docs/how_to/message_history/#adding-message-history

export type IGetChatChain = {
  chatId: string;
  message: string;
  user: IUserFull;
};

export const getChatChain = async ({
  chatId,
  user,
  message,
}: IGetChatChain) => {
  const aiResponseLimit = 5;

  const inputKey = "question";
  const currentHistoryKey = "history";
  const userId = user._id.toString();

  const chatHistory = getChatHistory({ chatId });

  const currentMessages = await chatHistory.getMessages();

  const nAiResponses = currentMessages.reduce((acc, entry) => {
    if (entry._getType() === "ai") {
      acc += 1;
    }
    return acc;
  }, 0);
  const isEnding = nAiResponses > aiResponseLimit;

  let relevantContextString = "";

  // --------------------------
  // GET PREVIOUS CONTEXTS
  // --------------------------

  if (!isEnding) {
    const prevChatsRetriever = getUserRetriever({
      chatId,
      userId,
      vectorStore: memoryVectorStore,
      type: "prevChats",
    });

    const relevantContext = await prevChatsRetriever._getRelevantDocuments(
      message
    );

    relevantContextString = formatDocumentsAsString(relevantContext);
  }

  // --------------------------
  // TEMPLATE
  // --------------------------

  let templateInput: ChatTemplateInput = [["system", agentTemplate]];

  if (user.archetype) {
    templateInput.push([
      "system",
      `User archetype is ${user.archetype.name}. Description: ${user.archetype.description}`,
    ]);
  }
  if (user.athleteInfo) {
    const infos = Object.entries(user.athleteInfo).reduce<string[]>(
      (acc, entry) => {
        if (!entry) return acc;
        const [key, value] = entry;
        if (value) {
          acc.push(`{Q: ${value.question}, A: ${value.answer}}`);
        }
        return acc;
      },
      []
    );
    templateInput.push([
      "system",
      `Here is a questionnaire the athlete answered: [${infos.join(",")}]`,
    ]);
  }

  if (relevantContextString) {
    templateInput.push([
      "system",
      `Previous sessions context: ${relevantContextString}`,
    ]);
  }

  if (isEnding) {
    templateInput.push([
      "system",
      "You have reached final of this current session. You must now politely end the session, answering the athlete's last question and telling the athlete a story that fits the current session and will help the athlete. You should use real great players or philosophers as characters for this story. Add Stoicism topics and beliefs to it.",
    ]);
  }

  templateInput.push(new MessagesPlaceholder(currentHistoryKey));
  templateInput.push(["human", `{${inputKey}}`]);

  console.log("❗ templateInput -->", templateInput);

  console.log("❗ isEnding -->", isEnding);
  console.log("❗ nAiResponses -->", nAiResponses);

  // --------------------------
  // END TEMPLATE
  // --------------------------

  const prompt = ChatPromptTemplate.fromMessages(templateInput);

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
    isEnding,
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
