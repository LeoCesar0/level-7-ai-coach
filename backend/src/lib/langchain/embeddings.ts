import { OpenAIEmbeddings } from "@langchain/openai";
import { EMBEDDING_BATCH_SIZE, EMBEDDING_MODEL } from "./@static";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OpenAI API key");
}

export const openAiEmbeddings = new OpenAIEmbeddings({
  apiKey: apiKey,
  batchSize: EMBEDDING_BATCH_SIZE,
  model: EMBEDDING_MODEL,
});
