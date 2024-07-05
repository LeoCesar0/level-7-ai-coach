// import { IAssessment } from "../../routes/assessment/schemas/assessment";
import { getChatHistory } from "./getChatHistory";
import { IAssessment } from "../../routes/assessment/schemas/assessment";
import {
  zAssessmentAIResponse,
  zCreateAssessment,
} from "../../routes/assessment/schemas/createAssessment";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { chatOpenAI } from "../../lib/langchain/chatOpenAi";
import { getAssessmentTopicsText } from "../../routes/assessment/schemas/enums";

export type IGetChatAssessment = {
  chatId: string;
  userId: string;
  userArchetype?: string;
  userPreviousData: IAssessment[];
};

const assessmentInstructions = `Your goal is to evaluate the following athlete conversation with the coach. You must assess the athlete's progress, information and data. Then answer it in the schema provided. You don't need try to collect all possible data, but only those you can infer from the chat history. You should keep in mind the user's archetype, his goals, experience and previous data.`;

const athleteArchetype =
  "The Rising Star: Young athletes with high potential benefit significantly from targeted development and motivational strategies. Focusing on their growth and skill enhancement can help them reach their peak performance early and sustain it over time.";

export const getChatAssessment = async ({
  chatId,
  userId,
  userPreviousData, // TODO
  userArchetype = athleteArchetype,
}: IGetChatAssessment) => {
  const chatHistory = getChatHistory({ chatId });

  const history = await chatHistory.getMessages(); // message type: BaseMessage[]

  const messages = history
    .map((item) => {
      const type = item._getType();
      return `${type}: ${item.toDict().data.content}`;
    })
    .join("\n");

  const parser = StructuredOutputParser.fromZodSchema(
    z.array(zAssessmentAIResponse)
  );

  const assessmentTopicsExplanation = getAssessmentTopicsText();

  const templateString = [
    assessmentInstructions,
    assessmentTopicsExplanation,
    `Athlete Archetype: '''${athleteArchetype}'''`,
    "{format_instructions}",
    "{history}",
  ];

  const chain = RunnableSequence.from([
    PromptTemplate.fromTemplate(templateString.join("\n")),
    chatOpenAI,
  ]);

  const instructions = parser.getFormatInstructions();

  const chainResult = await chain.invoke({
    history: messages,
    format_instructions: instructions,
  });

  const stringRes = chainResult.toDict().data.content;

  const entries = await parser.parse(stringRes);

  return { entries, messages };
};
