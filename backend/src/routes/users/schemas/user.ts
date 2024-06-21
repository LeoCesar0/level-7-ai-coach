import { HydratedDocument, model } from "mongoose";
import { z } from "zod";
import { zId, zUUID, zodSchema } from "@zodyac/zod-mongoose";
import { zMongooseBase } from "../../../@schemas/mongoose";

export const zUserRaw = z.object({
  name: z.string().min(3).max(255),
  active: z.boolean().default(false),
  uid: z.string().min(1)
  //   access: z.enum(["admin", "user"]).default("user"),
  //   teamId: zId.describe("ObjectId:Company"),
  //   address: z.object({
  //     street: z.string(),
  //     city: z.string(),
  //     state: z.string(),
  //   }),
  //   tags: z.array(z.string()),
  //   createdAt: z.date(),
  //   updatedAt: z.date(),
  //   birthday: z.date(),
});

export const zUser = zUserRaw.merge(zMongooseBase);

export type UserRaw = z.output<typeof zUserRaw>;
export type User = z.output<typeof zUser>;

export const UserMongoSchema = model<UserRaw>("User", zodSchema(zUserRaw));
