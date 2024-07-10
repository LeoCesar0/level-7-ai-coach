import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

export type IGetUserRetriever = {
  vectorStore: MongoDBAtlasVectorSearch;
  userId: string;
  chatId?: string;
  type: "user" | "prevChats" | "currentChat";
};

export const getUserRetriever = ({
  userId,
  vectorStore,
  type,
  chatId,
}: IGetUserRetriever) => {
  if (type === "currentChat") {
    if (!chatId) throw new Error("chatId is required for currentChat type");
    return vectorStore.asRetriever({
      filter: {
        preFilter: {
          user_id: {
            $eq: userId,
          },
          chat_id: {
            $eq: chatId,
          },
        },
      },
    });
  }
  if (type === "prevChats") {
    if (!chatId) throw new Error("chatId is required for currentChat type");
    return vectorStore.asRetriever({
      filter: {
        preFilter: {
          user_id: {
            $eq: userId,
          },
          chat_id: {
            $ne: chatId,
          },
        },
      },
      // k: 10
    });
  }

  return vectorStore.asRetriever({
    filter: {
      preFilter: {
        user_id: {
          $eq: userId,
        },
      },
    },
  });
};
