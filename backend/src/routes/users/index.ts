import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { UserMongoSchema, zUserRaw, User } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";

const userRoute = new Hono()
  // --------------------------
  // LIST USERS
  // --------------------------
  .get("/", async (ctx) => {
    const list = await UserMongoSchema.find();

    const resData: AppResponse<User[]> = {
      data: list,
      error: null,
    };

    return ctx.json(resData);
  })
  // --------------------------
  // GET USER BY ID
  // --------------------------
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    const user = await UserMongoSchema.findById(id);

    const resData: AppResponse<User> = {
      data: user,
      error: null,
    };

    return ctx.json(resData);
  })
  // --------------------------
  // CREATE USER
  // --------------------------
  .post("/", zValidator("json", zUserRaw), async (ctx) => {
    const input = ctx.req.valid("json");

    const createdUserDoc = await UserMongoSchema.create(input);

    const createdUser = createdUserDoc.toObject();
    const resData: AppResponse<User> = {
      data: createdUser,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default userRoute;
