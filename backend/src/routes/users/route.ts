import { Context, Hono } from "hono";
import { UserModel, IUser } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { EXCEPTIONS } from "../../static/exceptions";
import { firebaseAuth } from "../../lib/firebase";
import { authValidator } from "../../middlewares/authValidator";
import { createAppUser } from "../../services/createAppUser";
import { zSignUp } from "./schemas/signUpRoute";
import { zAthleteInfo } from "./schemas/athleteInfo";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { updateUserInfoRoute } from "./schemas/updateInfoRoute";

const userRoute = new Hono()
  // --------------------------
  // LIST USERS
  // --------------------------
  .get("/", async (ctx) => {
    const list = await UserModel.find();

    const resData: AppResponse<IUser[]> = {
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

    const resData: AppResponse<IUser> = {
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
    authValidator({ permissionsTo: ["admin"] }),
    async (ctx) => {
      const inputs = ctx.req.valid("json");
      let resData: AppResponse<IUser>;

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
  )
  // --------------------------
  // UPDATE ATHLETE USER
  // --------------------------
  .put(
    "/info",
    routeValidator({
      schema: updateUserInfoRoute,
    }),
    authValidator({ permissionsTo: ["user"] }),
    async (ctx) => {
      const inputs = ctx.req.valid("json");
      let resData: AppResponse<IUser>;

      // @ts-ignore
      const contextUser: IUser | undefined = ctx.get("reqUser");

      if (!contextUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      if (contextUser.role !== "user") {
        throw new HTTPException(400, { message: EXCEPTIONS.ONLY_ATHLETE });
      }
      const updatedUserDoc = await UserModel.findByIdAndUpdate(
        inputs.userId,
        {
          info: inputs.info,
        },
        {
          new: true,
        }
      );

      if (!updatedUserDoc) {
        throw new HTTPException(404, { message: "User not found" });
      }
      const updatedUser = updatedUserDoc.toObject();

      resData = {
        data: updatedUser,
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
