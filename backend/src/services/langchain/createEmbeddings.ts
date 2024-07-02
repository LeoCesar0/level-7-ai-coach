import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { openAiEmbeddings } from "../../lib/langchain/embeddings";

export type ICreateEmbeddings = {
  messages: string[];
};

export async function createEmbeddings({ messages }: ICreateEmbeddings) {
  const embeddings = await openAiEmbeddings.embedDocuments(messages);

  return embeddings;
}
