import { zIsoDate } from "@/@schemas/primitives/isoDate";
import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";

export const zCreateChat = z.object({
  user: zId.describe("ObjectId:User"),
  date: zIsoDate
});

export type ICreateChat = z.infer<typeof zCreateChat>;
