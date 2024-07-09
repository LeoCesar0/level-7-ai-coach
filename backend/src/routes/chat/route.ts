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
import { EXCEPTIONS } from "../../static/exceptions.js";
import { processChatAssessment } from "../../services/assessment/processChatAssessment.js";
import { getUserFull } from "../../services/getUserFull.js";
import mongoose, { Mongoose } from "mongoose";
import { handleDBSession } from "../../handlers/handleDBSession.js";
import { createNullishFilter } from "../../helpers/createNullishFilter";

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
      const { date, user: userId } = ctx.req.valid("json");

      const user = await getUserFull({ userId });

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const chatsToClose = await ChatModel.find({
        user: userId,
        $or: createNullishFilter("closed"),
        // $or: [
        //   { closed: { $exists: false } }, // `closed` does not exist
        //   { closed: { $eq: false } }, // `closed` is explicitly `false`
        //   { closed: { $eq: null } }, // `closed` is `null`
        // ],
      });

      return await handleDBSession(async (session) => {
        const newChat = await ChatModel.create(
          [
            {
              user: userId,
              date: date,
            },
          ],
          { session }
        );
        const chat = newChat[0].toObject();

        const resData: AppResponse<IChat> = {
          data: chat,
          error: null,
        };

        const promises: Promise<any>[] = [];

        try {
          for (const item of chatsToClose) {
            const promise = processChatAssessment({
              chatId: item._id,
              user: user,
              session,
            });
            promises.push(promise);
          }

          await Promise.all(promises);
        } catch (err) {}

        return ctx.json(resData, 200);
      });
    }
  )
  .post(
    "/send",
    routeValidator({
      schema: zCreateMessage,
    }),
    authValidator(),
    async (ctx) => {
      const {
        user: userId,
        message,
        chat: chatId,
        role,
      } = ctx.req.valid("json");

      let resData: AppResponse<any>;

      const userNow = new Date().toISOString();

      const userExists = await UserModel.exists({ _id: userId });

      if (!userExists) {
        throw new HTTPException(404, { message: "User not found" });
      }
      const foundChat = await ChatModel.findById(chatId.toString());
      if (!foundChat) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      if (foundChat.closed) {
        resData = {
          data: null,
          error: {
            message: EXCEPTIONS.CHAT_CLOSED,
            _isAppError: true,
            _message: "Closed chat",
          },
        };
        return ctx.json(resData, 400);
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

      resData = {
        data: {
          response,
        },
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .get(
    "/history/:id",
    routeValidator({
      schema: z.object({
        id: zStringNotEmpty,
      }),
      target: "param",
    }),
    authValidator(),
    async (c) => {
      const { id: chatId } = c.req.valid("param");

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
