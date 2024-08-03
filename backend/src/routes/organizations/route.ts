import { Hono } from "hono";
import { IOrganizationDoc, OrganizationModel } from "./schemas/organization";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { EXCEPTIONS } from "@common/static/exceptions";
import { IUserDoc, UserModel } from "../users/schemas/user";
import { firebaseAuth } from "../../lib/firebase";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { AppResponse } from "@common/schemas/app";
import { zStringNotEmpty } from "@common/schemas/primitives/stringNotEmpty";
import { FilterQuery } from "mongoose";
import { zPaginateRouteQueryInput } from "@common/schemas/pagination";
import { getReqUser } from "@/helpers/getReqUser";
import { API_ROUTE } from "@common/static/routes";
import { PERMISSION } from "@common/static/permissions";

const ROUTE = API_ROUTE.organizations;
const ROUTE_PERMISSION = PERMISSION.organizations;

const organizationsRoute = new Hono()
  // --------------------------
  // LIST
  // --------------------------
  .get(
    "/list",
    authValidator({ permissionsTo: ROUTE_PERMISSION.list }),
    async (ctx) => {
      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const filters: FilterQuery<IOrganizationDoc> = {};

      if (reqUser.role === "coach") {
        filters._id = reqUser.organization.toString();
      }

      const list = await OrganizationModel.find({
        ...filters,
      });

      const resData: AppResponse<IOrganizationDoc[]> = {
        data: list,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // PAGINATE
  // --------------------------
  .post(
    "/paginate",
    authValidator({ permissionsTo: ROUTE_PERMISSION.paginate }),
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

      const obligatoryFilters: FilterQuery<IOrganizationDoc> = {};

      if (reqUser.role === "user") {
        obligatoryFilters.active = true;
      }
      if (reqUser.role === "coach") {
        obligatoryFilters._id = reqUser.organization.toString();
      }

      const resData = await handlePaginationRoute<IOrganizationDoc>({
        model: OrganizationModel,
        body,
        obligatoryFilters,
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
    authValidator({ permissionsTo: ROUTE_PERMISSION.get }),
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
    routeValidator({ schema: ROUTE.create.bodySchema }),
    authValidator({ permissionsTo: ROUTE_PERMISSION.create }),
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
    routeValidator({ schema: ROUTE.update.bodySchema }),
    authValidator({ permissionsTo: ROUTE_PERMISSION.update }),
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

      const reqUser = getReqUser(ctx);

      const isSameOrg = reqUser?.organization.toString() === orgId;

      if (
        !reqUser || // NO REQ USER
        (reqUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
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
  .delete(
    "/:id",
    authValidator({ permissionsTo: ROUTE_PERMISSION.delete }),
    async (ctx) => {
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
    }
  );

export default organizationsRoute;
