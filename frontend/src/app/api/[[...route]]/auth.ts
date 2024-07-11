import { Hono } from "hono";
import { zSignIn } from "@/@schemas/signIn";
import { firebaseAuth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { AppResponse } from "@common/schemas/app";
import { routeValidator } from "@/middlewares/routeValidator";

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

      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      let resData: AppResponse = {
        data: result.user,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default authRoute;
