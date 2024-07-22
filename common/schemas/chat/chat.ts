import { z } from "zod";
import { zMongoDocument, zMongoDocumentClient } from "../mongo";
import type { IUser } from "../user/user";
import { zCreateChat } from "./create";

export const zChatBase = zCreateChat;

export const zChat = zChatBase.merge(zMongoDocumentClient);

export type IChat = z.infer<typeof zChat>;

export type IChatFull = Omit<IChat, "user"> & {
  user: IUser;
};
