import { Hono } from "hono";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { ArchetypeModel, IArchetypeDoc } from "./schemas/archetype";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { slugify } from "../../helpers/slugify";
import { EXCEPTIONS } from "@common/static/exceptions";
import { AppResponse } from "@common/schemas/app";
import { zCreateArchetype } from "@common/schemas/archetype/createArchetype";
import { zPaginateRouteQueryInput } from "@common/schemas/paginateRoute";
import { zUpdateArchetype } from "@common/schemas/archetype/updateArchetype";
import { getReqUser } from "@/helpers/getReqUser";
import { FilterQuery } from "mongoose";

const archetypeRoute = new Hono()
  .get("/list", authValidator({ permissionsTo: ["admin"] }), async (ctx) => {
    const reqUser = getReqUser(ctx);

    if (!reqUser) {
      throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
    }

    const list = await ArchetypeModel.find();

    const resData: AppResponse<IArchetypeDoc[]> = {
      data: list,
      error: null,
    };

    return ctx.json(resData, 200);
  })
  // --------------------------
  // create
  // --------------------------
  .post(
    "/",
    authValidator({ permissionsTo: ["admin"] }),
    routeValidator({
      schema: zCreateArchetype,
      target: "json",
    }),
    async (ctx) => {
      const { description, name } = ctx.req.valid("json");

      const slug = slugify(name);

      let resData: AppResponse<IArchetypeDoc>;

      const exists = await ArchetypeModel.findOne({ slug });
      if (exists) {
        resData = {
          data: null,
          error: {
            message: EXCEPTIONS.ITEM_EXISTS("Archetype"),
            _isAppError: true,
          },
        };
        return ctx.json(resData, 400);
      }

      const result = await ArchetypeModel.create({
        description,
        name,
        slug: slug,
      });

      resData = {
        data: result,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // GET
  // --------------------------
  .get(
    "/:id",
    authValidator({ permissionsTo: ["admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
   

      const result = await ArchetypeModel.findById(id);

      if (!result) {
        throw new HTTPException(404, { message: "Archetype not found" });
      }

      const resData: AppResponse<IArchetypeDoc> = {
        data: result,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // UPDATE
  // --------------------------
  .put(
    "/:id",
    authValidator({ permissionsTo: ["admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    routeValidator({
      schema: zUpdateArchetype,
      target: "json",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      const values = ctx.req.valid("json");

      if (!values || !Object.keys(values).length) {
        throw new HTTPException(400, { message: "No data to update" });
      }

      if (values.name) {
        values.slug = slugify(values.name);
      }

      const result = await ArchetypeModel.findByIdAndUpdate(
        id,
        {
          ...values,
        },
        {
          new: true,
        }
      );

      if (!result) {
        throw new HTTPException(404, { message: "Archetype not found" });
      }

      const resData: AppResponse<IArchetypeDoc> = {
        data: result,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // DELETE
  // --------------------------
  .delete(
    "/:id",
    authValidator({ permissionsTo: ["admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");


      const exists = await ArchetypeModel.findById(id);

      if (!exists) {
        throw new HTTPException(404, { message: "Archetype not found" });
      }

      const result = await ArchetypeModel.deleteOne({
        _id: id,
      });

      const resData: AppResponse<boolean> = {
        data: true,
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
    authValidator({ permissionsTo: ["admin"] }),
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

      const obligatoryFilters: FilterQuery<IArchetypeDoc> = {};

      const resData = await handlePaginationRoute<IArchetypeDoc>({
        model: ArchetypeModel,
        body,
        obligatoryFilters,
      });

      return ctx.json(resData, 200);
    }
  );

export default archetypeRoute;
