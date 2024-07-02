// import dotenv from "dotenv";

// dotenv.config({ path: "../.env" });

// import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
// import { sleep } from "langchain/util/time";
// import { mongoDBClient } from "../src/lib/mongodb";
// import { openAiEmbeddings } from "../src/lib/langchain/embeddings";

// console.log("❗ Starting Run Script");

// const namespace = "development.messages";
// const [dbName, collectionName] = namespace.split(".");
// const collection = mongoDBClient.db(dbName).collection(collectionName);

// export const vectorStore = new MongoDBAtlasVectorSearch(openAiEmbeddings, {
//   collection,
//   indexName: "messages", // The name of the Atlas search index. Defaults to "default"
//   textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
//   embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
// });

// await vectorStore.addDocuments([
//   {
//     pageContent: "Hey hey hey",
//     metadata: { docstore_document_id: "somevalue" },
//   },
// ]);

// const retriever = vectorStore.asRetriever({
//   filter: {
//     preFilter: {
//       docstore_document_id: {
//         $eq: "somevalue",
//       },
//     },
//   },
// });

// console.log("Sleep start");

// await sleep(2000);

// console.log("Sleep end");

// const results = await retriever.invoke("goodbye");

// console.log(results);
