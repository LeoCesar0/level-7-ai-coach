import { Hono } from "hono";
import { routeValidator } from "../../middlewares/routeValidator";
import { EXCEPTIONS } from "@common/static/exceptions";
import { firebaseAuth } from "../../lib/firebase";
import { authValidator } from "../../middlewares/authValidator";
import { createAppUser } from "../../services/createAppUser";
import { HTTPException } from "hono/http-exception";
import cloneDeep from "lodash.clonedeep";
import { OrganizationModel } from "../organizations/schemas/organization";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { getUserFull } from "../../services/getUserFull";
import { USER_POPULATES } from "@/static/populates";
import { AppResponse } from "@common/schemas/app";
import { IUserDoc, IUserFullDoc, UserModel } from "./schemas/user";
import { zCreateUserRoute } from "@common/schemas/user/createUserRoute";
import { zUpdateUser } from "@common/schemas/user/updateUserRoute";
import { getReqUser } from "@/helpers/getReqUser";
import { handleUpdateUser } from "./handler/handleUpdateUser";
import { zPaginateRouteQueryInput } from "@common/schemas/paginateRoute";
import { handlePaginatedSearch } from "@/handlers/handlePaginatedSearch";
import { COLLECTION } from "@/lib/langchain/@static";
import { SEARCH_INDEXES } from "@/handlers/dbIndexes/setup";
import { FilterQuery } from "mongoose";

const userRoute = new Hono()
  // --------------------------
  // PAGINATE
  // --------------------------
  .post(
    "/paginate",
    authValidator({ permissionsTo: ["admin", "coach"] }),
    routeValidator({
      schema: zPaginateRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");

      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const obligatoryFilters: FilterQuery<IUserDoc> = {};

      if (reqUser.role === "user") {
        obligatoryFilters.active = true;
      }
      if (reqUser.role === "coach") {
        obligatoryFilters.organization = reqUser.organization.toString();
      }
      if (body.searchQuery) {
        const resData = await handlePaginatedSearch<IUserDoc>({
          collectionName: COLLECTION.USERS,
          fields: body.searchFields
            ? (body.searchFields as (keyof IUserDoc)[])
            : ["name", "email"],
          searchIndexName: SEARCH_INDEXES.USERS,
          searchQuery: body.searchQuery,
          body,
          populates: {
            key: "organization",
            collectionName: COLLECTION.ORGANIZATIONS,
          },
          obligatoryFilters,
        });
        return ctx.json(resData, 200);
      }

      const resData = await handlePaginationRoute<IUserDoc>({
        model: UserModel,
        body,
        populates: USER_POPULATES,
        obligatoryFilters,
      });

      return ctx.json(resData, 200);
    }
  )
  .get("/me", authValidator(), async (ctx) => {
    const reqUser = getReqUser(ctx);

    if (!reqUser) {
      throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
    }

    const user = await getUserFull({ userId: reqUser._id.toString() });

    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }

    if (user && !user.active && reqUser.role === "user") {
      throw new HTTPException(401, { message: EXCEPTIONS.USER_NOT_ACTIVE });
    }

    const resData: AppResponse<IUserFullDoc> = {
      data: user,
      error: null,
    };

    return ctx.json(resData, 200);
  })
  // --------------------------
  // GET USER BY ID
  // --------------------------
  .get(
    "/:id",
    authValidator({ permissionsTo: ["admin", "coach", "user"] }),
    async (ctx) => {
      const userId = ctx.req.param("id");

      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const user = await getUserFull({ userId: userId });

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      if (user && !user.active && reqUser.role === "user") {
        throw new HTTPException(401, { message: EXCEPTIONS.USER_NOT_ACTIVE });
      }

      const resData: AppResponse<IUserFullDoc> = {
        data: user,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // CREATE USER
  // --------------------------
  .post(
    "/",
    routeValidator({ schema: zCreateUserRoute }),
    authValidator({ permissionsTo: ["admin", "coach"] }),
    async (ctx) => {
      const inputs = ctx.req.valid("json");
      let resData: AppResponse<IUserDoc>;

      console.log("❗ inputs -->", inputs);

      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const userValues = cloneDeep(inputs.user);

      if (reqUser.role !== "admin") {
        userValues.organization = reqUser.organization.toString();
      }

      const orgExists = await OrganizationModel.exists({
        _id: userValues.organization,
      });

      if (!orgExists) {
        resData = {
          data: null,
          error: {
            _isAppError: true,
            message: EXCEPTIONS.ORGANIZATION_NOT_EXISTS,
          },
        };
        return ctx.json(resData, 400);
      }

      const userInFirebase = await firebaseAuth
        .getUserByEmail(userValues.email)
        .catch((err) => {});

      const userInMongoDb = await UserModel.findOne({
        email: userValues.email,
      });

      if (userInMongoDb) {
        // --------------------------
        // USER ALREADY EXISTS IN FIREBASE AND MONGODB
        // --------------------------
        resData = {
          data: null,
          error: {
            _isAppError: true,
            message: EXCEPTIONS.USER_EMAIL_ALREADY_REGISTERED,
            _data: userInMongoDb,
          },
        };
        return ctx.json(resData, 400);
      }

      if (userInFirebase) {
        // --------------------------
        // USER EXISTS ONLY IN FIREBASE, CREATING NEW USER IN MONGO DB
        // --------------------------
        const createdUser = await createAppUser({
          inputs: {
            ...inputs,
            user: userValues,
          },
          firebaseId: userInFirebase.uid,
        });

        resData = {
          data: createdUser,
          error: null,
        };

        return ctx.json(resData, 200);
      }
      // --------------------------
      // USER DOES NOT EXIST YET
      // --------------------------

      const createdUser = await createAppUser({
        inputs: {
          ...inputs,
          user: userValues,
        },
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
    "/:id",
    routeValidator({
      schema: zUpdateUser,
    }),
    authValidator({ permissionsTo: ["user", "admin", "coach"] }),
    async (ctx) => {
      const userId = ctx.req.param("id");
      const inputs = ctx.req.valid("json");
      const reqUser = getReqUser(ctx);

      const res = handleUpdateUser({
        inputs,
        reqUser,
        userId,
      });
      return ctx.json(res, 200);
    }
  )
  .put(
    "/me",
    routeValidator({
      schema: zUpdateUser,
    }),
    authValidator({ permissionsTo: ["user", "admin", "coach"] }),
    async (ctx) => {
      const inputs = ctx.req.valid("json");
      const reqUser = getReqUser(ctx);
      const userId = reqUser?._id.toString();

      const res = handleUpdateUser({
        inputs,
        reqUser,
        userId,
      });
      return ctx.json(res, 200);
    }
  )
  .delete(
    "/:id",
    authValidator({ permissionsTo: ["admin", "coach"] }),
    async (ctx) => {
      const userId = ctx.req.param("id");
      let resData: AppResponse<boolean>;

      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const userToChange = await UserModel.findById(userId);

      if (!userToChange) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const isSameOrg =
        reqUser?.organization.toString() ===
        userToChange.organization?.toString();

      if (!userId) {
        throw new HTTPException(400, { message: "User id is required" });
      }

      if (
        !reqUser || // NO REQ USER
        (reqUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
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
      try {
        await firebaseAuth.deleteUser(userToChange.firebaseId);
      } catch (err) {
        if (process.env.NODE_ENV !== "test") {
          console.log("❌ Error deleting user from firebase", err);
        }
      }

      resData = {
        data: true,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default userRoute;
