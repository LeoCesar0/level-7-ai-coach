import { getReqUser } from "@/helpers/getReqUser";
import { Hono } from "hono";
import { authValidator } from "@/middlewares/authValidator";
import { handleSearch } from "@/handlers/handleSearch";
import { COLLECTION } from "@/lib/langchain/@static";
import { SEARCH_INDEXES } from "@/handlers/dbIndexes/setup";
import { IUser } from "@common/schemas/user/user";
import { handlePaginatedSearch } from "@/handlers/handlePaginatedSearch";
import { IUserFullDoc } from "../users/schemas/user";

const testRoute = new Hono()
  .get("/", authValidator(), async (ctx) => {
    const reqUser = getReqUser(ctx);

    const search = "john";

    const result = await handlePaginatedSearch<IUserFullDoc>({
      collectionName: COLLECTION.USERS,
      fields: ["name"],
      searchIndexName: SEARCH_INDEXES.USERS,
      searchQuery: search,
      page: 2,
      populates: {
        key: "organization",
        collectionName: COLLECTION.ORGANIZATIONS,
      },
    });

    return ctx.json({ result }, 200);
  })
  .get("/hello", async (ctx) => {
    return ctx.json({ hello: "world" }, 200);
  });

export default testRoute;
