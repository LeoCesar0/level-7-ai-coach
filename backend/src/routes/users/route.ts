import { Hono } from "hono";
import { UserModel, User, zSignUp } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { EXCEPTIONS } from "../../static/exceptions";
import { firebaseAuth } from "../../lib/firebase";
import {
  authValidator,
} from "../../middlewares/authValidator";
import { createAppUser } from "../../services/createAppUser";

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
    // bearerAuth({
    //   verifyToken: async (token, ctx) => {
    //     console.log("token", token);
    //     return token === "123";
    //   },
    //   prefix: "Bearer",
    // }),
    routeValidator({ schema: zSignUp }),
    authValidator({ permissionsTo: ["admin"] }),
    async (ctx) => {
      const inputs = ctx.req.valid("json");
      let resData: AppResponse<User>;

      const firebaseUserExists = await firebaseAuth
        .getUserByEmail(inputs.user.email)
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

      const createdUser = await createAppUser({
        inputs: inputs,
        withFirebaseUser: true,
      });

      resData = {
        data: createdUser,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );
// --------------------------
// UPDATE USER
// --------------------------
// .put("/:id", async (ctx) => {
//   const id = ctx.req.param("id");
//   const input = ctx.req.valid("json");

//   const updatedUser = await UserModel;
// });

export default userRoute;
