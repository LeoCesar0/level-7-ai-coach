// import { IAssessment } from "../../routes/assessment/schemas/assessment";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";
import { RunnableSequence } from "@langchain/core/runnables";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { chatOpenAI } from "../../../lib/langchain/chatOpenAi";
import { ChatTemplateInput } from "../../../@schemas/langchain";
import { IAssessmentDoc } from "@/routes/assessment/schemas/assessment";
import { IUserFullDoc } from "@/routes/users/schemas/user";
import { getAssessmentTopicsText } from "@common/schemas/assessment/enums";
import { zAssessmentAIResponse } from "@common/schemas/assessment/createAssessement";

export type IGetAssessment = {
  user: IUserFullDoc;
  userPreviousData: IAssessmentDoc[];
  messages: string;
  type: "journal" | "chat";
  extraTemplate?: ChatTemplateInput;
};

const chatAssessmentInstructions =
  "Your goal is to evaluate the following athlete conversation with the coach. You must assess the athlete's progress or downsides, information and data. Then answer it in the schema provided. You don't need try to collect all possible data, but only those you can infer from the chat history. You should keep in mind the user's archetype, his goals, experience and previous data.";
const journalAssessmentInstructions =
  "Your goal is to evaluate the following athlete's journal or diary. You must infer the athlete's progress or downsides, information and data. Then answer it in the schema provided. You don't need try to collect all possible data, but only those you can infer from the journal. You should keep in mind the user's archetype, his goals, experience and previous data.";
const generalInstructions =
  "If the user's input has not enough data or information, you should not fake data";

export const getAssessment = async ({
  userPreviousData, // TODO
  user,
  messages,
  type,
  extraTemplate = [],
}: IGetAssessment) => {
  const userArchetype = user.archetype;

  const parser = StructuredOutputParser.fromZodSchema(
    z.array(zAssessmentAIResponse)
  );

  const { explanation: assessmentTopicsExplanation } =
    getAssessmentTopicsText();

  const formattedInstructions = parser.getFormatInstructions();

  // --------------------------
  // Create Template
  // --------------------------

  const systemInstructions =
    type === "journal"
      ? journalAssessmentInstructions
      : chatAssessmentInstructions;

  // -------------------------- STRING TEMPLATE

  // const templateString = [systemInstructions, assessmentTopicsExplanation];
  // if (userArchetype) {
  //   templateString.push(
  //     `${userArchetype.name}: '''${userArchetype.description}'''`
  //   );
  // }
  // templateString.push("{format_instructions}", "{history}");

  // const prompTemplate = PromptTemplate.fromTemplate(templateString.join("\n"));

  // -------------------------- CHAT TEMPLATE

  // const templates = [
  //   ["system", systemInstructions],
  //   ["system", assessmentTopicsExplanation],
  // ];

  // if (userArchetype) {
  //   templates.push([
  //     "system",
  //     `The athlete's archetype is ${userArchetype.name}: '''${userArchetype.description}'''`,
  //   ]);
  // }
  // templates.push(new MessagesPlaceholder('format_instructions'))
  // templates.push(new MessagesPlaceholder('history'))

  let templateInputs: ChatTemplateInput = [
    ["system", systemInstructions],
    ["system", assessmentTopicsExplanation],
    ["system", generalInstructions],
  ];

  const extraInfo: ChatTemplateInput = [...extraTemplate];
  if (userArchetype) {
    extraInfo.push([
      "system",
      `The athlete's archetype is ${userArchetype.name}: '''${userArchetype.description}'''`,
    ]);
  }

  const finalInputs: ChatTemplateInput = [
    ...extraInfo,
    ["system", "{format_instructions}"],
    new MessagesPlaceholder("history"),
  ];

  templateInputs = templateInputs.concat(finalInputs);

  const promptTemplate = ChatPromptTemplate.fromMessages(templateInputs);

  // --------------------------

  const chain = RunnableSequence.from([
    // PromptTemplate.fromTemplate(templateString.join("\n")),
    promptTemplate,
    chatOpenAI,
  ]);

  const chainResult = await chain.invoke({
    history: messages,
    format_instructions: formattedInstructions,
  });

  const stringRes = chainResult.toDict().data.content;

  const entries = await parser.parse(stringRes);

  return { entries };
};
