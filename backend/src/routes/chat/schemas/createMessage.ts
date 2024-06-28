import { zId } from "@zodyac/zod-mongoose";
import { z } from "zod";
import { zStringNotEmpty } from "../../../@schemas/primitives/stringNotEmpty";
import { zChatRole } from "../../../@schemas/roles";

export type ICreateMessage = z.infer<typeof zCreateMessage>;

export const zCreateMessage = z.object({
  chat: zId.describe("ObjectId:Chat"),
  user: zId.describe("ObjectId:User"),
  message: zStringNotEmpty,
  role: zChatRole,
});
