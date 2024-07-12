import { HTTPException } from "hono/http-exception";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { zCreateMessage } from "../chat/schemas/createMessage";
import { getChatChainV2 } from "../../services/langchain/getChatChainV2";
import { UserModel } from "../users/schemas/user";
import { ChatModel } from "../chat/schemas/chat";
import { Hono } from "hono";
import { zCreateArchetype } from "../archetype/schemas/createArchetype";
import { getCollection } from "@/services/mongodb/getCollection";
import { COLLECTION } from "@/lib/langchain/@static";
import { ArchetypeModel } from "../archetype/schemas/archetype";

export const playgroundRoute = new Hono()
  .post(
    "/",
    routeValidator({
      schema: zCreateArchetype,
    }),
    async (c) => {
      const { description, name, slug } = c.req.valid("json");

      console.log("❗❗❗ Here ");

      // await ArchetypeModel.create({
      //   name,
      //   description,
      //   slug: name + Date.now().toString(),
      // });

      const items = await ArchetypeModel.find();

      // const collection = getCollection({ name: "users" });
      // const users = await collection.find().toArray();

      return c.json(
        {
          hello: name,
          items,
        },
        200
      );
    }
  )
  .get("/test", async (c) => {
    return c.json({ hello: "world" });
  });
