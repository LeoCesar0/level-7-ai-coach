import { OpenAIEmbeddings } from "@langchain/openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OpenAI API key");
}

export const openAiEmbeddings = new OpenAIEmbeddings({
  apiKey: apiKey,
  batchSize: 1536,
  model: "text-embedding-ada-002",
});
