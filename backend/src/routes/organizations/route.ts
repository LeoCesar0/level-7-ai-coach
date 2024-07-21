import { Hono } from "hono";
import { IOrganizationDoc, OrganizationModel } from "./schemas/organization";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { zPaginateRouteQueryInput } from "@/@schemas/paginateRoute";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { EXCEPTIONS } from "@common/static/exceptions";
import { IUserDoc, UserModel } from "../users/schemas/user";
import { firebaseAuth } from "../../lib/firebase";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { AppResponse } from "@common/schemas/app";
import { zCreateOrganization } from "@common/schemas/organization/createOrganization";
import { zOrganization } from "@common/schemas/organization/organization";
import { zStringNotEmpty } from "@common/schemas/primitives/stringNotEmpty";

const organizationsRoute = new Hono()
  // --------------------------
  // LIST
  // --------------------------
  .post(
    "/list",
    authValidator({ permissionsTo: ["admin", "user", "coach"] }),
    routeValidator({
      schema: zPaginateRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const resData = await handlePaginationRoute<IOrganizationDoc>({
        model: OrganizationModel,
        body,
        reqUser,
        modelHasActive: true,
      });

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // GET BY ID
  // --------------------------
  .get(
    "/:id",
    routeValidator({
      target: "param",
      schema: z.object({ id: zStringNotEmpty }),
    }),
    authValidator({ permissionsTo: ["admin"] }),
    async (ctx) => {
      const id = ctx.req.param("id");

      const item = await OrganizationModel.findById(id);

      if (!item) {
        throw new HTTPException(404, { message: "Organization not found" });
      }

      const resData: AppResponse<IOrganizationDoc> = {
        data: item,
        error: null,
      };

      return ctx.json(resData);
    }
  )
  // --------------------------
  // CREATE
  // --------------------------
  .post(
    "/",
    routeValidator({ schema: zCreateOrganization }),
    authValidator({ permissionsTo: ["admin"] }),
    async (ctx) => {
      const input = ctx.req.valid("json");

      const createdDoc = await OrganizationModel.create(input);

      const createdItem = createdDoc.toObject();
      const resData: AppResponse<IOrganizationDoc> = {
        data: createdItem,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .put(
    "/:id",
    routeValidator({ schema: zOrganization.partial() }),
    authValidator({ permissionsTo: ["admin", "coach"] }),
    async (ctx) => {
      const orgId = ctx.req.param("id");
      const inputs = ctx.req.valid("json");

      if (!inputs || !Object.keys(inputs).length) {
        throw new HTTPException(400, { message: "No data to update" });
      }

      if (!orgId) {
        throw new HTTPException(400, {
          message: "Organization id is required",
        });
      }

      // @ts-ignore
      const contextUser: IUser | undefined = ctx.get("reqUser");

      const isSameOrg = contextUser?.organization.toString() === orgId;

      if (
        !contextUser || // NO REQ USER
        (contextUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
      ) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }
      const result = await OrganizationModel.updateOne(
        {
          _id: orgId,
        },
        inputs
      );
      const updatedDoc = await OrganizationModel.findById(orgId);

      if (!updatedDoc) {
        throw new HTTPException(404, { message: "Organization not found" });
      }

      const updatedItem = updatedDoc.toObject();
      const resData: AppResponse<IOrganizationDoc> = {
        data: updatedItem,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .delete("/:id", authValidator({ permissionsTo: ["admin"] }), async (ctx) => {
    const orgId = ctx.req.param("id");

    if (!orgId) {
      throw new HTTPException(400, {
        message: "Organization id is required",
      });
    }

    const orgToDelete = await OrganizationModel.findById<
      Omit<IOrganizationDoc, "users"> & { users: IUserDoc[] }
    >(orgId).populate("users");

    if (!orgToDelete) {
      throw new HTTPException(404, {
        message: "Organization not found",
      });
    }

    const orgIsAdmin = orgToDelete.adminOrganization;

    if (orgIsAdmin) {
      const resData: AppResponse<boolean> = {
        data: null,
        error: {
          message: "Cannot delete admin organization",
          _isAppError: true,
        },
      };
      return ctx.json(resData, 403);
    }

    const usersOnOrg = orgToDelete.users.filter(
      (user) => user.role !== "admin"
    );

    await OrganizationModel.deleteOne({
      _id: orgId,
    });
    await UserModel.deleteMany({
      organization: orgId,
    });

    for (const user of usersOnOrg) {
      try {
        await firebaseAuth.deleteUser(user.firebaseId);
      } catch (err) {
        if (process.env.NODE_ENV !== "test") {
          console.log("❌ Error deleting user from firebase", err);
        }
      }
    }

    const resData: AppResponse<boolean> = {
      data: true,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default organizationsRoute;
