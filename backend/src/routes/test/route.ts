import { getReqUser } from "@/helpers/getReqUser";
import { Hono } from "hono";
import { authValidator } from "@/middlewares/authValidator";
import { zMongoDocument } from "@/@schemas/mongo";
import { handleSearch } from "@/handlers/handleSearch";
import { COLLECTION } from "@/lib/langchain/@static";
import { SEARCH_INDEXES } from "@/handlers/dbIndexes/setup";
import { IUser } from "@common/schemas/user/user";

const testRoute = new Hono()
  .get("/", authValidator(), async (ctx) => {
    const reqUser = getReqUser(ctx);

    const search = "joh";

    const result = await handleSearch<IUser>({
      collectionName: COLLECTION.USERS,
      fields: ["name"],
      searchIndexName: SEARCH_INDEXES.USERS,
      searchQuery: search,
    });

    return ctx.json({ result }, 200);
  })
  .get("/hello", async (ctx) => {
    return ctx.json({ hello: "world" }, 200);
  });

export default testRoute;
