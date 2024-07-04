import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { openAiEmbeddings } from "./embeddings";
import { getCollection } from "../../services/mongodb/getCollection";
import { MEMORY_INDEX, MEMORY_COLLECTION } from "./@static";

const collection = getCollection({ name: MEMORY_COLLECTION });

export const memoryVectorStore = new MongoDBAtlasVectorSearch(
  openAiEmbeddings,
  {
    collection,
    indexName: MEMORY_INDEX, // The name of the Atlas search index. Defaults to "default"
    textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  }
);
