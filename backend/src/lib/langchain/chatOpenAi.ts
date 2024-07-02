import { ChatOpenAI } from "@langchain/openai";
import { CHAT_MODEL } from "./@static";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OpenAI API key");
}

export const chatOpenAI = new ChatOpenAI({
  model: CHAT_MODEL,
  temperature: 0,
  apiKey,
})
