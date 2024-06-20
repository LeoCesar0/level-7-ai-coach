import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { UserRaw, UserMongoSchema, zUserRaw, User } from "./schemas/user";
import { HydratedDocument } from "mongoose";
import { HTTPException } from "hono/http-exception";
import { AppError, AppResponse } from "../../@schemas/app";

const userRoute = new Hono()
  // --------------------------
  // LIST USERS
  // --------------------------
  .get("/", async (ctx) => {
    const list = await UserMongoSchema.find();

    return ctx.json({
      data: list,
      error: null,
    });
  })
  // --------------------------
  // GET USER BY ID
  // --------------------------
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    return ctx.json({
      message: "User id -->",
      id,
    });
  })
  // --------------------------
  // CREATE USER
  // --------------------------
  .post("/", zValidator("json", zUserRaw), async (ctx) => {
    console.log("HERE");
    const input = ctx.req.valid("json");

    const createdUserDoc = await UserMongoSchema.create(input);

    const createdUser = createdUserDoc.toObject();

    // const createdUser = UserMongoSchema.create({
    //   test: "a",
    // });

    const resData: AppResponse<User> = {
      data: createdUser,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default userRoute;
