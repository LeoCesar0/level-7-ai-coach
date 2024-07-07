import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { ArchetypeModel, IArchetype } from "./schemas/archetype";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { zCreateArchetype } from "./schemas/createArchetype";
import { zListRouteQueryInput } from "../../@schemas/listRoute";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { slugify } from "../../helpers/slugify";
import { EXCEPTIONS } from "../../static/exceptions";

const archetypeRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    "/",
    authValidator({ permissionsTo: ["coach", "admin"] }),
    routeValidator({
      schema: zCreateArchetype,
      target: "json",
    }),
    async (ctx) => {
      const { description, name } = ctx.req.valid("json");
      // @ts-ignore

      const slug = slugify(name);

      let resData: AppResponse<IArchetype>;

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
    authValidator({ permissionsTo: ["user", "coach", "admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      // @ts-ignore

      const result = await ArchetypeModel.findById(id);

      if (!result) {
        throw new HTTPException(404, { message: "Archetype not found" });
      }

      const resData: AppResponse<IArchetype> = {
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
    authValidator({ permissionsTo: ["coach", "admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    routeValidator({
      schema: zCreateArchetype,
      target: "json",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      const values = ctx.req.valid("json");
      // @ts-ignore

      const result = await ArchetypeModel.findByIdAndUpdate(
        id,
        {
          name: values.name,
          description: values.description,
          slug: slugify(values.name),
        },
        {
          new: true,
        }
      );

      if (!result) {
        throw new HTTPException(404, { message: "Archetype not found" });
      }

      const resData: AppResponse<IArchetype> = {
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
    authValidator({ permissionsTo: ["coach", "admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id } = ctx.req.valid("param");
      // @ts-ignore

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
  // LIST
  // --------------------------
  .post(
    "/list",
    authValidator({ permissionsTo: ["admin", "user", "coach"] }),
    routeValidator({
      schema: zListRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const resData = await handlePaginationRoute<IArchetype>({
        model: ArchetypeModel,
        body,
        reqUser,
        modelHasActive: false,
      });

      return ctx.json(resData, 200);
    }
  );

export default archetypeRoute;
