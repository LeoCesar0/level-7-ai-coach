import { HydratedDocument, model } from "mongoose";
import { z } from "zod";
import { zId, zUUID, zodSchema } from "@zodyac/zod-mongoose";
import { zMongooseBase } from "../../../@schemas/mongoose";
import { zRole } from "../../../@schemas/roles";
import { EXCEPTIONS } from "../../../static/exceptions";

export const zUserRaw = z.object({
  uid: z.string().min(1, { message: EXCEPTIONS.FIELD_REQUIRED("uid") }),
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  role: zRole.default("user"),
  organizationId: zId.describe("ObjectId:Company"),
});

export const zUser = zUserRaw.merge(zMongooseBase);

export type UserRaw = z.output<typeof zUserRaw>;
export type User = z.output<typeof zUser>;

export const UserMongoSchema = model<UserRaw>("User", zodSchema(zUserRaw));
