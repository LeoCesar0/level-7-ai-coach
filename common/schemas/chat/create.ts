import { zId } from "@zodyac/zod-mongoose";
import { zIsoDate } from "../primitives/isoDate";
import { z } from "zod";

export const zCreateChat = z.object({
  user: zId.describe("ObjectId:User"),
  date: zIsoDate,
});

export type ICreateChatDoc = z.infer<typeof zCreateChat>;

export type ICreateChat = Omit<ICreateChatDoc, "user"> & { user: string };
