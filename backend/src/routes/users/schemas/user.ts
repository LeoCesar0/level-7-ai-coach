import { HydratedDocument, model } from "mongoose";
import { z } from "zod";
import { zId, zUUID, zodSchema } from "@zodyac/zod-mongoose";
import { zMongooseBase } from "../../../@schemas/mongoose";
import { zRole } from "../../../@schemas/roles";

export const zUserRaw = z.object({
  uid: z.string().min(1),
  name: z.string().min(3).max(255),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  access: zRole.default("user"),

});

export const zUser = zUserRaw.merge(zMongooseBase);

export type UserRaw = z.output<typeof zUserRaw>;
export type User = z.output<typeof zUser>;

export const UserMongoSchema = model<UserRaw>("User", zodSchema(zUserRaw));
