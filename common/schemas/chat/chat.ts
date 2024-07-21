import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { ClientParser, zMongoDocument, zMongoDocumentClient } from "../mongo";
import { IUser } from "../user";

// user: zId.describe("ObjectId:User"),

export const zChatBase = z.object({
  user: z.string(),
  date: z.string(),
  closed: z.boolean(),
  assessed: z.boolean(),
});

export const zChatDocBase = z
  .object({
    date: z.date(),
    closed: z.boolean(),
    assessed: z.boolean(),
  })
  .merge(zMongoDocument);

export const zChat = zChatBase.merge(zMongoDocumentClient);

export type IChat = z.infer<typeof zChat>;

export type IChatFull = Omit<IChat, "user"> & {
  user: IUser;
};
