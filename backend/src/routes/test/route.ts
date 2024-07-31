import { getReqUser } from "@/helpers/getReqUser";
import { Hono } from "hono";
import { authValidator } from "@/middlewares/authValidator";
import { handleSearch } from "@/handlers/handleSearch";
import { COLLECTION } from "@/lib/langchain/@static";
import { SEARCH_INDEXES } from "@/handlers/dbIndexes/setup";
import { IUser } from "@common/schemas/user/user";
import { handlePaginatedSearch } from "@/handlers/handlePaginatedSearch";
import { IUserDoc, IUserFullDoc, UserModel } from "../users/schemas/user";
import { zPaginateRouteQueryInput } from "@common/schemas/pagination";
import { routeValidator } from "@/middlewares/routeValidator";
import { HTTPException } from "hono/http-exception";
import { EXCEPTIONS } from "@common/static/exceptions";

const testRoute = new Hono()
  .get(
    "/",
    authValidator(),
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

      const search = "john";

      const result = await handlePaginatedSearch<IUserDoc>({
        collectionName: COLLECTION.USERS,
        fields: ["name"],
        searchIndexName: SEARCH_INDEXES.USERS,
        searchQuery: search,
        body,
        populates: {
          key: "organization",
          collectionName: COLLECTION.ORGANIZATIONS,
        },
      });

      return ctx.json({ result }, 200);
    }
  )
  .get("/hello", async (ctx) => {
    return ctx.json({ hello: "world" }, 200);
  });

export default testRoute;
