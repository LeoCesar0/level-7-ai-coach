import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { openAiEmbeddings } from "./embeddings";
import { getCollection } from "../../services/mongodb/getCollection";
import { HISTORY_COLLECTION, HISTORY_INDEX } from "./@static";

const collection = getCollection({ name: HISTORY_COLLECTION });

export const historyVectorStore = new MongoDBAtlasVectorSearch(
  openAiEmbeddings,
  {
    collection,
    indexName: HISTORY_INDEX, // The name of the Atlas search index. Defaults to "default"
    textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
    embeddingKey: "embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
  }
);
