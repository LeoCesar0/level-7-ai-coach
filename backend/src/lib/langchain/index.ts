// // import { ChatOpenAI } from "langchain/chat_models/openai";
// import { MemoryVectorStore } from "langchain/vectorstores/memory";

// MemoryVectorStore.fromDocuments

// const openai = new OpenAIAgent({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export const generateResponse = async (message, userContext) => {
//   const prompt = `User Info: ${JSON.stringify(
//     userContext
//   )}\n\nUser: ${message}\nCoach:`;
//   const response = await openai.completions.create({
//     model: "",
//     prompt,
//     max_tokens: 150,
//   });
//   return response.choices[0].text.trim();
// };
