import { getReqUser } from "@/helpers/getReqUser";
import { Hono } from "hono";
import { UserModel } from "../users/schemas/user";
import { authValidator } from "@/middlewares/authValidator";

const testRoute = new Hono()
  .get("/", authValidator(), async (ctx) => {
    const reqUser = getReqUser(ctx);

    console.log("❗ reqUser -->", reqUser);

    const users = await UserModel.find();

    const firstUser = users[0];

    console.log("❗ firstUser -->", firstUser);

    return ctx.json({ reqUser, firstUser }, 200);
  })
  .get("/hello", async (ctx) => {
    return ctx.json({ hello: "world" }, 200);
  });

export default testRoute;
