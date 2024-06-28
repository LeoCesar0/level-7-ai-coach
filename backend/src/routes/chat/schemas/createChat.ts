import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zCreateChat = z.object({
  user: zId.describe("ObjectId:User"),
  date: z.string().date().transform(item => new Date(item)),
})