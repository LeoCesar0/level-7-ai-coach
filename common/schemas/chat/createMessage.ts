import { zId } from "@zodyac/zod-mongoose";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";
import { IMessageType, zMessageType } from "./message";
import { z } from "zod";

export const zCreateMessage = z.object({
  chat: zStringNotEmpty,
  user: zStringNotEmpty,
  message: zStringNotEmpty,
  role: zMessageType.optional().default("human"),
});

export type ICreateMessage = z.infer<typeof zCreateMessage>
