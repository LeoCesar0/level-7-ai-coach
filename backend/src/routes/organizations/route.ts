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
      console.log("❗❗❗");
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
  );

export default organizationsRoute;
