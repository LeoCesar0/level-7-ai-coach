import { Hono } from "hono";
import { UserModel, zCreateUser, User } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../helpers/routeValidator";
import { z } from "zod";
import { EXCEPTIONS } from "../../static/exceptions";
import { OrganizationModel } from "../organizations/schemas/organization";

const userRoute = new Hono()
  // --------------------------
  // LIST USERS
  // --------------------------
  .get("/", async (ctx) => {
    const list = await UserModel.find();

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

    const user = await UserModel.findById(id);

    const resData: AppResponse<User> = {
      data: user,
      error: null,
    };

    return ctx.json(resData);
  })
  // --------------------------
  // CREATE USER
  // --------------------------
  .post("/", routeValidator({ schema: zCreateUser }), async (ctx) => {
    const input = ctx.req.valid("json");

    const createdUserDoc = await UserModel.create(input);

    const createdUser = createdUserDoc.toObject();

    await OrganizationModel.updateOne(
      { _id: createdUser.organization },
      { $push: { users: createdUser._id } }
    );

    const resData: AppResponse<User> = {
      data: createdUser,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default userRoute;
