// import { MemoryVectorStore } from "langchain/vectorstores/memory";
// import { OpenAIEmbeddings } from "@langchain/openai";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// const textSplitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 1000,
//   chunkOverlap: 200,
// });

// const splits = await textSplitter.splitDocuments(docs);

// const vectorstore = await MemoryVectorStore.fromDocuments(
//   splits,
//   new OpenAIEmbeddings()
// );

// const retriever = vectorstore.asRetriever();