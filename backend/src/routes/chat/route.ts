import { Hono } from "hono";
// import { generateResponse } from "../utils/langchain.js";
import { UserModel } from "../users/schemas/user.js";
import { IMessage, MessageModel } from "./schemas/message.js";
import { ChatModel, IChat } from "./schemas/chat.js";
import { routeValidator } from "../../middlewares/routeValidator.js";
import { zCreateChat } from "./schemas/createChat.js";
import { AppResponse } from "../../@schemas/app.js";
import { zCreateMessage } from "./schemas/createMessage.js";
import { authValidator } from "../../middlewares/authValidator.js";
import { z } from "zod";
import { zStringNotEmpty } from "../../@schemas/primitives/stringNotEmpty.js";

export const chatRouter = new Hono()
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
    "/send",
    routeValidator({
      schema: zCreateMessage,
    }),
    authValidator(),
    async (c) => {
      const { user: userId, message, chat, role } = c.req.valid("json");

      // const user = await UserModel.findById(userId);
      // if (!user) {
      //   return c.json({ message: "User not found" }, 404);
      // }

      const userMessageM = new MessageModel({
        user: userId,
        message,
        chat,
        role,
      });
      const userMessageDoc = await userMessageM.save();
      const userMessage = userMessageDoc.toObject();

      // const newResponseMessage = new MessageModel({ userId, message: response });
      // await newResponseMessage.save();

      const resData: AppResponse<IMessage> = {
        data: userMessage,
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
