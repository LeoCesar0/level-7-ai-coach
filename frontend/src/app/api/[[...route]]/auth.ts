import { Hono } from "hono";
import { routeValidator } from "../../../../../backend/src/middlewares/routeValidator";
import { zSignIn } from "@/@schemas/signIn";
import { firebaseAuth } from "@/lib/firebase";

const authRoute = new Hono()
  .get("/", async (ctx) => {
    const data = {
      hello: "test",
    };

    return ctx.json({ data: data });
  })
  .get("/me", async (ctx) => {
    return ctx.json({ currentUser: firebaseAuth.currentUser });
  })
  .post(
    "/sign-in",
    routeValidator({
      schema: zSignIn,
      target: "json",
    }),
    async (ctx) => {
      const data = ctx.req.valid("json");

      return ctx.json({ data: data }, 200);
    }
  );

export default authRoute;
