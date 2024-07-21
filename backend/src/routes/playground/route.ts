import { Hono } from "hono";
import { ArchetypeModel } from "../archetype/schemas/archetype";

export const playgroundRoute = new Hono().post("/", async (c) => {
  console.log("❗❗❗ Here playground ");

  const items = await ArchetypeModel.find();

  return c.json(
    {
      items,
    },
    200
  );
});
