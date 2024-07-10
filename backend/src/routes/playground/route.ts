import { HTTPException } from "hono/http-exception";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { zCreateMessage } from "../chat/schemas/createMessage";
import { getChatChainV2 } from "../../services/langchain/getChatChainV2";
import { UserModel } from "../users/schemas/user";
import { ChatModel } from "../chat/schemas/chat";
import { AppResponse } from "../../@schemas/app";
import { Hono } from "hono";
import { zCreateArchetype } from "../archetype/schemas/createArchetype";

export const playgroundRoute = new Hono().post(
  "/",
  routeValidator({
    schema: zCreateArchetype,
  }),
  async (c) => {
    const { description, name, slug } = c.req.valid("json");

    const users = await UserModel.find();

    return c.json(
      {
        hello: name,
        users,
      },
      200
    );
  }
);
