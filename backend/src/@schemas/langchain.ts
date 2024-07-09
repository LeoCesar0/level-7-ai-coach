import { ChatPromptTemplate } from "@langchain/core/prompts";

export type ChatTemplateInput = Parameters<typeof ChatPromptTemplate.fromMessages>[0];
