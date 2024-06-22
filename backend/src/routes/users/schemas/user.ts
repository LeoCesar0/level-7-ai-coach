import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";
import { z } from "zod";
import { zId, zUUID, zodSchema } from "@zodyac/zod-mongoose";
import { MongoDocument, zMongoDocument } from "../../../@schemas/mongoose";
import { zRole } from "../../../@schemas/roles";
import { EXCEPTIONS } from "../../../static/exceptions";
import { ROLES_LIST } from "../../../static/roles";

// export type User = z.infer<typeof zUser>;

export const zCreateUser = z.object({
  firebaseId: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("firebaseId") }),
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  role: zRole.default("user"),
  organization: zId.describe("ObjectId:Organization"),
});

export const zUser = zCreateUser.merge(zMongoDocument);

export type CreateUser = z.infer<typeof zCreateUser>;

// export type User = InferSchemaType<typeof userSchema>;
export type User = z.infer<typeof zUser>;

export const userSchema = new Schema<User>(
  {
    firebaseId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    imageUrl: {
      type: String,
    },
    role: {
      type: String,
      enum: ROLES_LIST,
      default: "user",
    },
    organization: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Organization",
    },
  },
  { timestamps: true }
);

// export const zUser = zCreateUser.merge(zMongoDocument);

// export const UserModel = model<UserRaw>("User", zodSchema(zUserRaw));
export const UserModel = model<User>("User", userSchema);
