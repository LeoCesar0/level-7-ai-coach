// import { IAssessment } from "../../routes/assessment/schemas/assessment";
import { getChatHistory } from "./getChatHistory";
import { IAssessment } from "../../routes/assessment/schemas/assessment";
import {
  ICreateAssessment,
  zAssessmentAIResponse,
  zCreateAssessment,
} from "../../routes/assessment/schemas/createAssessment";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { chatOpenAI } from "../../lib/langchain/chatOpenAi";
import { getAssessmentTopicsText } from "../../routes/assessment/schemas/enums";
import { IArchetype } from "../../routes/archetype/schemas/archetype";

export type IGetChatAssessment = {
  chatId: string;
  userArchetype?: IArchetype;
  userPreviousData: IAssessment[];
};

const assessmentInstructions = `Your goal is to evaluate the following athlete conversation with the coach. You must assess the athlete's progress, information and data. Then answer it in the schema provided. You don't need try to collect all possible data, but only those you can infer from the chat history. You should keep in mind the user's archetype, his goals, experience and previous data.`;

export const getChatAssessment = async ({
  chatId,
  userPreviousData, // TODO
  userArchetype,
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

  // --------------------------
  // Create Template
  // --------------------------
  const templateString = [assessmentInstructions, assessmentTopicsExplanation];
  if (userArchetype) {
    templateString.push(
      `${userArchetype.name}: '''${userArchetype.description}'''`
    );
  }
  templateString.push("{format_instructions}", "{history}");
  // --------------------------

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
