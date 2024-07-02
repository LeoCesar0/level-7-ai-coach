import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export type ICreateDocuments = {
  messages: string[];
  metadatas?: Record<string, any>[] | undefined;
};

export const createDocuments = async ({
  messages,
  metadatas,
}: ICreateDocuments) => {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 100,
    chunkOverlap: 20,
  });

  const output = await splitter.createDocuments(messages, metadatas);

  return output;
};
