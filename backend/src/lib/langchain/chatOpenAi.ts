import { ChatOpenAI } from "@langchain/openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Missing OpenAI API key");
}

export const chatOpenAI = new ChatOpenAI({
  model: "gpt-3.5-turbo",
  temperature: 0,
  apiKey,
})
