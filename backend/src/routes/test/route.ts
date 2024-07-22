import { getReqUser } from "@/helpers/getReqUser";
import { Hono } from "hono";
import { authValidator } from "@/middlewares/authValidator";
import { zMongoDocument } from "@/@schemas/mongo";

const testRoute = new Hono()
  .get("/", authValidator(), async (ctx) => {
    const reqUser = getReqUser(ctx);

    const test = zMongoDocument.parse({
      _id: "60b1a7d7b7e6b8001f3f9c1c",
      __v: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // console.log("❗ reqUser -->", reqUser);

    // const users = await UserModel.find();

    // const firstUser = users[0];

    // console.log("❗ firstUser -->", firstUser);

    return ctx.json({ reqUser, test }, 200);
  })
  .get("/hello", async (ctx) => {
    return ctx.json({ hello: "world" }, 200);
  });

export default testRoute;
