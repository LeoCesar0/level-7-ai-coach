import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { ClientParser, zMongoDocument } from "../mongo";
import { IUser } from "../user";

export const zChatDoc = z
  .object({
    user: zId.describe("ObjectId:User"),
    date: z.date(),
    closed: z.boolean(),
    assessed: z.boolean(),
  })
  .merge(zMongoDocument);

export type IChatDoc = z.infer<typeof zChatDoc>;

export type IChat = ClientParser<IChatDoc>;

export type IChatFull = Omit<IChat, "user"> & {
  user: IUser;
};
