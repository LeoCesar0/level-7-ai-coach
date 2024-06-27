import { Hono } from "hono";
import {
  OrganizationModel,
  Organization,
  zOrganization,
} from "./schemas/organization";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { PaginationResult } from "../../@schemas/pagination";
import { zListRouteQueryInput } from "../../@schemas/listRoute";
import {
  CreateOrganization,
  zCreateOrganization,
} from "./schemas/createOrganization";
import { z } from "zod";
import { zStringNotEmpty } from "../../@schemas/primitives/stringNotEmpty";
import { HTTPException } from "hono/http-exception";
import { EXCEPTIONS } from "../../static/exceptions";
import { UserModel } from "../users/schemas/user";
import { firebaseAuth } from "../../lib/firebase";

const organizationsRoute = new Hono()
  // --------------------------
  // LIST
  // --------------------------
  .get(
    "/",
    authValidator({ permissionsTo: ["admin"] }),
    routeValidator({
      schema: zListRouteQueryInput,
      target: "query",
    }),
    async (ctx) => {
      const query = ctx.req.valid("query");

      // const parsed = zListRouteQueryParsed.parse(query);

      const limit = query.limit;
      const page = query.page;
      const sortBy = (query.sortBy as keyof Organization) ?? "createdAt";
      const sortOrder = query.sortOrder ?? "desc";

      const list = await OrganizationModel.find()
        .sort({ createdAt: sortOrder })
        .skip((page - 1) * limit)
        .limit(limit);

      const resData: AppResponse<PaginationResult<Organization>> = {
        data: {
          list: list,
          total: list.length,
          page: page,
          limit: limit,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false,
          nextPage: null,
          prevPage: null,
        },
        error: null,
      };

      return ctx.json(resData);
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

      const resData: AppResponse<Organization> = {
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
      const createdDoc = await OrganizationModel.create<CreateOrganization>(
        input
      );

      const createdItem = createdDoc.toObject();
      const resData: AppResponse<Organization> = {
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
      // const updatedDoc = await OrganizationModel.findByIdAndUpdate(
      //   orgId,
      //   inputs,
      //   {
      //     new: true,
      //   }
      // );

      if (!updatedDoc) {
        throw new HTTPException(404, { message: "Organization not found" });
      }

      const updatedItem = updatedDoc.toObject();
      const resData: AppResponse<Organization> = {
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

    await OrganizationModel.deleteOne({
      _id: orgId,
    });
    const usersToDelete = await UserModel.find({ organization: orgId });
    await UserModel.deleteMany({
      organization: orgId,
    });

    for (const user of usersToDelete) {
      try {
        await firebaseAuth.deleteUser(user.firebaseId);
      } catch (err) {}
    }

    const resData: AppResponse<boolean> = {
      data: true,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default organizationsRoute;
