import { HTTPException } from "hono/http-exception";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { zCreateMessage } from "../chat/schemas/createMessage";
import { getChatChainV2 } from "../../services/langchain/getChatChainV2";
import { UserModel } from "../users/schemas/user";
import { ChatModel } from "../chat/schemas/chat";
import { AppResponse } from "../../@schemas/app";
import { Hono } from "hono";

export const playgroundRoute = new Hono().post(
  "/",
  routeValidator({
    schema: zCreateMessage,
  }),
  authValidator(),
  async (c) => {
    const { user: userId, message, chat: chatId, role } = c.req.valid("json");

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

    const resData: AppResponse<any> = {
      data: result,
      error: null,
    };

    return c.json(resData, 200);
  }
);
