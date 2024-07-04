import { ChatOpenAI } from "@langchain/openai";
import { CHAT_MODEL, CHAT_TEMPERATURE } from "./@static";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OpenAI API key");
}

export const chatOpenAI = new ChatOpenAI({
  model: CHAT_MODEL,
  temperature: CHAT_TEMPERATURE,
  apiKey,
})
