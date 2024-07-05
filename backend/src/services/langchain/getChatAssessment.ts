// import { IAssessment } from "../../routes/assessment/schemas/assessment";
import { getChatHistory } from "./getChatHistory";
import { IAssessment } from "../../routes/assessment/schemas/assessment";
import {
  ICreateAssessment,
  zCreateAssessment,
} from "../../routes/assessment/schemas/createAssessment";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { chatOpenAI } from "../../lib/langchain/chatOpenAi";

export type IGetChatAssessment = {
  chatId: string;
  userId: string;
  userPreviousData: IAssessment[];
};

const assessmentInstructions = `Your goal is to evaluate the following athlete conversation with the coach. You must assess the athlete's progress, information and data. Then answer it in the schema provided. You don't need try to collect all possible data, but only those you can infer from the chat history. You should keep in mind the user's archetype, his goals, experience and previous data.`;

const athleteArchetype =
  "The Rising Star: Young athletes with high potential benefit significantly from targeted development and motivational strategies. Focusing on their growth and skill enhancement can help them reach their peak performance early and sustain it over time.";

export const getChatAssessment = async ({
  chatId,
  userId,
  userPreviousData,
}: IGetChatAssessment) => {
  const chatHistory = getChatHistory({ chatId });

  const history = await chatHistory.getMessages(); // message type: BaseMessage[]

  const messages = history
    .map((item) => {
      const type = item._getType();
      return `${type}: ${item.toDict().data.content}`;
    })
    .join("\n");

  console.log("❗ messages -->", messages);

  const parser = StructuredOutputParser.fromZodSchema(
    z.array(zCreateAssessment)
  );

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(
      `${assessmentInstructions}.\nuser:${userId};chat:${chatId}\n{format_instructions}\n{history}`
    ),
    chatOpenAI,
    parser,
  ]);

  const instructions = parser.getFormatInstructions();

  console.log("❗ instructions -->", instructions);

  const result = await chain.invoke({
    history: messages,
    format_instructions: instructions,
  });

  console.log("❗ result -->", result);

  //   let result: IAssessment[] = [];

  return { result, messages };
};
