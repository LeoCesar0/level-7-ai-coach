import { Hono } from "hono";
import { UserModel, User, zSignUp } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../helpers/routeValidator";
import { EXCEPTIONS } from "../../static/exceptions";
import { OrganizationModel } from "../organizations/schemas/organization";
import { firebaseAuth } from "../../lib/firebase";
import { bearerAuth } from "hono/bearer-auth";
import { createFirebaseUser } from "../../services/createFirebaseUser";

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
  .post(
    "/",
    routeValidator({ schema: zSignUp }),
    bearerAuth({
      verifyToken: async (token, ctx) => {
        console.log("token", token);
        return token === "123";
      },
      prefix: "Bearer",
    }),
    async (ctx) => {
      const input = ctx.req.valid("json");
      let resData: AppResponse<User>;

      const firebaseUserExists = await firebaseAuth
        .getUserByEmail(input.user.email)
        .catch((err) => {});

      if (firebaseUserExists) {
        resData = {
          data: null,
          error: {
            _isAppError: true,
            message: EXCEPTIONS.USER_ALREADY_EXISTS,
          },
        };
        return ctx.json(resData, 400);
      }

      const createdFirebaseUser = await createFirebaseUser({
        inputs: input,
      });

      const createdUserDoc = await UserModel.create({
        ...input.user,
        firebaseId: createdFirebaseUser.uid,
      });

      const createdUser = createdUserDoc.toObject();

      await OrganizationModel.updateOne(
        { _id: createdUser.organization },
        { $push: { users: createdUser._id } }
      );

      resData = {
        data: createdUser,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default userRoute;
