import { zId } from "@zodyac/zod-mongoose";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";
import { IMessageType, zMessageType } from "./message";
import { z } from "zod";

export const zCreateMessage = z.object({
  chat: zId.describe("ObjectId:Chat"),
  user: zId.describe("ObjectId:User"),
  message: zStringNotEmpty,
  role: zMessageType.optional().default("human"),
});

export type ICreateMessage = {
  user: string;
  message: string;
  role: IMessageType;
  chat: string;
};
