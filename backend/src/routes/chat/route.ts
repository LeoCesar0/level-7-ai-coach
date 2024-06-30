import { Hono } from "hono";
// import { generateResponse } from "../utils/langchain.js";
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
import { EXCEPTIONS } from "../../static/exceptions.js";
import { openAiEmbeddings } from "../../lib/langchain/embeddings.js";
import { getChatMemory } from "../../lib/langchain/chatMemory.js";
import { zValidator } from "@hono/zod-validator";
import { AnyArray } from "mongoose";

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
    zValidator("query", z.object({ first: z.boolean().optional() })),
    authValidator(),
    async (c) => {
      const { user: userId, message, chat, role } = c.req.valid("json");
      const { first } = c.req.valid("query");

      // const firstMessagePromp = first

      // const user = await UserModel.findById(userId);
      // if (!user) {
      //   return c.json({ message: "User not found" }, 404);
      // }
      // const messageEmbedding = await openAiEmbeddings.embedDocuments([message]);

      const userMessageM = new MessageModel({
        user: userId,
        message,
        chat,
        role,
        // messageEmbedding,
      });
      const userMessageDoc = await userMessageM.save();
      const userMessage = userMessageDoc.toObject();

      const { chain, chainWithHistory, memory } = getChatMemory({
        chatId: chat.toString(),
      });

      const resChain = await chainWithHistory.invoke(
        { question: message },
        {
          configurable: {
            sessionId: chat.toString(),
          },
        }
      );

      console.log("❗ resChain -->", resChain);

      // const resChain = await chain.invoke({ input: message });

      // console.log("❗ resChain -->", resChain);

      const chatHistory = await memory.chatHistory.getMessages();

      console.log("❗ chatHistory -->", chatHistory);

      // const newResponseMessage = new MessageModel({ userId, message: response });
      // await newResponseMessage.save();

      const resData: AppResponse<any> = {
        data: resChain,
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
