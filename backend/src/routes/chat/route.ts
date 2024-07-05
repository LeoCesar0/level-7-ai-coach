import { Hono } from "hono";
import { IUser, UserModel } from "../users/schemas/user.js";
import { IMessage, MessageModel } from "./schemas/message.js";
import { ChatModel, IChat } from "./schemas/chat.js";
import { routeValidator } from "../../middlewares/routeValidator.js";
import { zCreateChat } from "./schemas/createChat.js";
import { AppResponse } from "../../@schemas/app.js";
import { zCreateMessage } from "./schemas/createMessage.js";
import { authValidator } from "../../middlewares/authValidator.js";
import { z } from "zod";
import { zStringNotEmpty } from "../../@schemas/primitives/stringNotEmpty.js";
import { HTTPException } from "hono/http-exception";
import { getChatChain } from "../../services/langchain/getChatChain.js";
import { memoryVectorStore } from "../../lib/langchain/memoryVectorStore.js";
import { createDocuments } from "../../services/langchain/createDocuments.js";
import { getChatChainV2 } from "../../services/langchain/getChatChainV2.js";
import { mongoDBClient } from "../../lib/mongodb.js";
import { getCollection } from "../../services/mongodb/getCollection.js";
import { ICreateMemoryMessage, IMemoryMessage } from "../../@schemas/memory.js";
import { formatDocumentsAsString } from "langchain/util/document";

export const chatRouter = new Hono()
  .get(
    "/",
    authValidator({ permissionsTo: ["admin", "coach", "user"] }),
    async (ctx) => {
      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUser;
      let list: IChat[] = [];

      if (reqUser.role === "admin") {
        list = await ChatModel.find();
      } else if (reqUser.role === "coach") {
        list = await ChatModel.find({ organization: reqUser.organization });
      } else if (reqUser.role === "user") {
        list = await ChatModel.find({ user: reqUser._id });
      }

      const resData: AppResponse<IChat[]> = {
        data: list,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .get(
    "/messages",
    authValidator({ permissionsTo: ["admin", "coach", "user"] }),
    async (ctx) => {
      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUser;
      let list: IMessage[] = [];

      if (reqUser.role === "admin") {
        list = await MessageModel.find();
      } else if (reqUser.role === "coach") {
        list = await MessageModel.find({ organization: reqUser.organization });
      } else if (reqUser.role === "user") {
        list = await MessageModel.find({ user: reqUser._id });
      }

      const resData: AppResponse<IMessage[]> = {
        data: list,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .post(
    "/",
    routeValidator({
      schema: zCreateChat,
    }),
    authValidator(),
    async (ctx) => {
      const { date, user } = ctx.req.valid("json");

      const newChat = new ChatModel({
        user: user,
        date: date,
      });
      const chatDoc = await newChat.save();
      const chat = chatDoc.toObject();

      const resData: AppResponse<IChat> = {
        data: chat,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .post(
    "/messages",
    routeValidator({
      schema: zCreateMessage,
    }),
    authValidator(),
    async (c) => {
      const { user: userId, message, chat: chatId, role } = c.req.valid("json");

      const userNow = new Date().toISOString();

      const userExists = await UserModel.exists({ _id: userId });

      if (!userExists) {
        throw new HTTPException(404, { message: "User not found" });
      }
      const chatExists = await ChatModel.exists({ _id: chatId });
      if (!chatExists) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      // const userMessageM = new MessageModel({
      //   user: userId,
      //   message,
      //   chat: chatId,
      //   role,
      //   // messageEmbedding,
      // });
      // const userMessageDoc = await userMessageM.save();
      // const userMessage = userMessageDoc.toObject();

      // --------------------------
      // V1
      // --------------------------

      const { chain } = await getChatChain({
        chatId: chatId.toString(),
        userId: userId.toString(),
        message,
      });

      const response = await chain.invoke(
        {
          question: message,
        },
        {
          configurable: {
            sessionId: chatId.toString(),
          },
        }
      );

      const aiAnswer = response.toDict().data.content;

      // --------------------------
      // V2
      // --------------------------

      // const { chain, currentHistory } = await getChatChainV2({
      //   chatId: chatId.toString(),
      //   userId: userId.toString(),
      //   message,
      // });

      // const response = await chain.invoke({
      //   input: message,
      // });

      // const messages = [message, response.answer];

      // --------------------------
      // V2 END
      // --------------------------

      const aiNow = new Date().toISOString();
      const messages = [message, aiAnswer];

      const metaData: ICreateMemoryMessage[] = [
        {
          type: "human",
          user_id: userId.toString(),
          chat_id: chatId.toString(),
          created_at: userNow,
        },
        {
          type: "ai",
          user_id: userId.toString(),
          chat_id: chatId.toString(),
          created_at: aiNow,
        },
      ];

      const documents = await createDocuments({
        messages: messages,
        metadatas: metaData,
      });

      await memoryVectorStore.addDocuments(documents);

      // await ChatModel.updateOne(
      //   {
      //     _id: chat,
      //   },
      //   {
      //     embedding: historyEmbedding,
      //     messages: chatHistoryMessagesAsString,
      //   }
      // );

      // const resChain = await chain.invoke({ input: message });
      // console.log("❗ resChain -->", resChain);

      // const chatHistory = await memory.chatHistory.getMessages();
      // console.log("❗ chatHistory -->", chatHistory);

      // const newResponseMessage = new MessageModel({ userId, message: response });
      // await newResponseMessage.save();

      const resData: AppResponse<any> = {
        data: {
          response,
        },
        error: null,
      };

      return c.json(resData, 200);
    }
  )
  .post(
    "/test",
    routeValidator({
      schema: zCreateMessage,
    }),
    authValidator(),
    async (c) => {
      const { user: userId, message, chat: chatId, role } = c.req.valid("json");

      console.log("❗ enter chat route");
      // const collection = getCollection({ name: "history" });
      // await collection.deleteMany();
      // const collection2 = getCollection({ name: "memory" });
      // await collection2.deleteMany();
      // return c.json({ message: "done" }, 200);

      const userExists = await UserModel.exists({ _id: userId });

      if (!userExists) {
        throw new HTTPException(404, { message: "User not found" });
      }
      const chatExists = await ChatModel.exists({ _id: chatId });
      if (!chatExists) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      const { chain } = await getChatChainV2({
        chatId: chatId.toString(),
        userId: userId.toString(),
        message,
      });

      const result = await chain.invoke({ input: message });

      console.log("❗ result -->", result);

      const resData: AppResponse<any> = {
        data: result,
        error: null,
      };

      return c.json(resData, 200);
    }
  )
  .get(
    "/history",
    routeValidator({
      schema: z.object({
        userId: zStringNotEmpty,
        chatId: zStringNotEmpty,
      }),
      target: "query",
    }),
    authValidator(),
    async (c) => {
      const { userId, chatId } = c.req.valid("query");

      const messages = await MessageModel.find({
        user: userId,
        chat: chatId,
      }).sort({
        createdAt: -1,
      });

      const resData: AppResponse<IMessage[]> = {
        data: messages,
        error: null,
      };

      return c.json(resData, 200);
    }
  );
