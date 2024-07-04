import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MESSAGES_CHUNK_OVERLAP, MESSAGES_CHUNK_SIZE } from "../../lib/langchain/@static";

export type ICreateDocuments = {
  messages: string[];
  metadatas?: Record<string, any>[] | undefined;
};

export const createDocuments = async ({
  messages,
  metadatas,
}: ICreateDocuments) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: MESSAGES_CHUNK_SIZE,
    chunkOverlap: MESSAGES_CHUNK_OVERLAP,
  });

  const output = await splitter.createDocuments(messages, metadatas);

  return output;
};
