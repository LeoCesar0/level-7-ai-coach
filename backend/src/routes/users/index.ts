import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";

const userSchema = z.object({
  name: z.string().min(1),
  birthday: z.string(),
});

type User = z.infer<typeof userSchema>;

const list: User[] = [];

const userRoute = new Hono()
  .get("/", async (ctx) => {
    return ctx.json({
      data: list,
      error: null,
    });
  })
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    return ctx.json({
      message: "User id -->",
      id,
    });
  })
  .post("/", zValidator("form", userSchema), async (ctx) => {
    const user = ctx.req.valid("form");

    list.push(user);

    return ctx.json({
      data: user,
      error: null,
    });
  });

export default userRoute;
