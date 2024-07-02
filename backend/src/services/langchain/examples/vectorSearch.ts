// // vectorSearch.js
// import { MongoClient } from "mongodb";
// import { getChatCollection } from "./getChatCollection";

// const client = new MongoClient(process.env.MONGODB_URI);

// export const embedHistory = async (history) => {
//   const embeddings = await embeddingFunction(history);
//   await client.db("chatDB").collection("embeddings").insertOne({ history, embeddings });
//   return embeddings;
// };

// export const searchEmbeddings = async (history, currentEmbeddings) => {
//   const chatCollection = getChatCollection()
//   const result = await client.db("chatDB").collection("embeddings").find({ embeddings: { $near: currentEmbeddings } }).toArray();
//   return result.map(res => res.history);
// };
