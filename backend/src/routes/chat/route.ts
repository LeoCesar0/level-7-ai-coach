import { Hono } from "hono";
import { IUser, UserModel } from "../users/schemas/user.js";
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
import { ICreateMemoryMessage } from "../../@schemas/memory.js";
import { getChatHistory } from "../../services/langchain/getChatHistory.js";
import { StoredMessage } from "@langchain/core/messages";

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

      const resData: AppResponse<any> = {
        data: {
          response,
        },
        error: null,
      };

      return c.json(resData, 200);
    }
  )
  .get(
    "/history",
    routeValidator({
      schema: z.object({
        chat: zStringNotEmpty,
      }),
      target: "query",
    }),
    authValidator(),
    async (c) => {
      const { chat: chatId } = c.req.valid("query");

      const exists = await ChatModel.findById(chatId);
      if (!exists) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      const chatHistory = getChatHistory({ chatId });

      const baseMessages = await chatHistory.getMessages();

      const messages = baseMessages.map((item) => item.toDict());

      const resData: AppResponse<StoredMessage[]> = {
        data: messages,
        error: null,
      };

      return c.json(resData, 200);
    }
  );
