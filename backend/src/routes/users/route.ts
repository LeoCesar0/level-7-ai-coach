import { Hono } from "hono";
import { UserModel, IUser } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { EXCEPTIONS } from "../../static/exceptions";
import { firebaseAuth } from "../../lib/firebase";
import { authValidator } from "../../middlewares/authValidator";
import { createAppUser } from "../../services/createAppUser";
import { zSignUp } from "./schemas/signUpRoute";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import { updateUserRoute } from "./schemas/updateUserRoute";
import cloneDeep from "lodash.clonedeep";
import { OrganizationModel } from "../organizations/schemas/organization";

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
  // UPDATE USER
  // --------------------------
  .put(
    "/:userId",
    routeValidator({
      schema: updateUserRoute,
    }),
    authValidator({ permissionsTo: ["user", "admin", "coach"] }),
    async (ctx) => {
      const userId = ctx.req.param("userId");
      const inputs = ctx.req.valid("json");
      let resData: AppResponse<IUser>;

      const userToChange = await UserModel.findById(userId);

      if (!userToChange) {
        throw new HTTPException(404, { message: "User not found" });
      }

      // @ts-ignore
      const contextUser: IUser | undefined = ctx.get("reqUser");

      const isSameOrg =
        contextUser?.organization.toString() ===
        userToChange.organization?.toString();

      if (!userId) {
        throw new HTTPException(400, { message: "User id is required" });
      }

      if (
        !contextUser || // NO REQ USER
        (contextUser.role === "user" && contextUser._id !== userId) || // REQ USER IS USER AND NOT THE SAME USER
        (contextUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
      ) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const infoObject = Object.entries(inputs.info || {}).reduce(
        (acc, [key, value]) => {
          acc[`info.${key}`] = value;
          return acc;
        },
        {} as Record<string, any>
      );

      let values: typeof inputs = cloneDeep(inputs);
      delete values.info;

      const updatedUserDoc = await UserModel.findByIdAndUpdate(
        userId,
        {
          ...values,
          $set: infoObject,
        },
        {
          new: true,
        }
      );

      if (!updatedUserDoc) {
        throw new HTTPException(404, { message: "User not found" });
      }
      const updatedUser = updatedUserDoc.toObject();

      const prevOrg = userToChange.organization?.toString();
      const newOrg = updatedUser.organization?.toString();
      const changedOrg = newOrg && prevOrg !== newOrg;
      if (changedOrg) {
        await OrganizationModel.updateMany(
          {
            _id: prevOrg,
          },
          {
            $pull: { users: userId },
          }
        );
        await OrganizationModel.updateMany(
          {
            _id: newOrg,
          },
          {
            $addToSet: { users: userId },
          }
        );
      }

      resData = {
        data: updatedUser,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .delete(
    "/:userId",
    authValidator({ permissionsTo: ["admin", "coach"] }),
    async (ctx) => {
      const userId = ctx.req.param("userId");
      let resData: AppResponse<boolean>;

      // @ts-ignore
      const contextUser: IUser | undefined = ctx.get("reqUser");

      const userToChange = await UserModel.findById(userId);

      if (!userToChange) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const isSameOrg =
        contextUser?.organization.toString() ===
        userToChange.organization?.toString();

      if (!userId) {
        throw new HTTPException(400, { message: "User id is required" });
      }

      if (
        !contextUser || // NO REQ USER
        (contextUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
      ) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const result = await UserModel.deleteOne({ _id: userId });

      if (userToChange.organization) {
        await OrganizationModel.updateMany(
          {
            _id: userToChange.organization,
          },
          {
            $pull: { users: userId },
          }
        );
      }

      await firebaseAuth.deleteUser(userToChange.firebaseId);

      resData = {
        data: true,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default userRoute;
