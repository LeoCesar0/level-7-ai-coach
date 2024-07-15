import { Hono } from "hono";
import { zSignIn } from "@/@schemas/signIn";
import { firebaseAuth } from "@/lib/firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithCredential,
} from "firebase/auth";
import { AppResponse } from "@common/schemas/app";
import { routeValidator } from "@/middlewares/routeValidator";
import { cookies } from "next/headers";

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
  .get("/test-register", async (ctx) => {
    const createResult = await createUserWithEmailAndPassword(
      firebaseAuth,
      "dev_fulano@test.com",
      "password123456789"
    );

    console.log("❗ create createResult -->", createResult);

    return ctx.json({
      createResult,
    });
  })
  .post(
    "/sign-in",
    routeValidator({
      schema: zSignIn,
      target: "json",
    }),
    async (ctx) => {
      const data = ctx.req.valid("json");

      console.log("❗ data in -->", data);

      const result = await signInWithEmailAndPassword(
        firebaseAuth,
        data.email,
        data.password
      );

      console.log("❗ result -->", result);

      const token = await result.user.getIdToken();

      cookies().set("token", token);

      let resData: AppResponse = {
        data: {
          user: result.user,
          token: token,
        },
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default authRoute;
