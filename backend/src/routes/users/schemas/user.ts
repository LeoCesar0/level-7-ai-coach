import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { ROLES_LIST } from "../../../static/roles";
import { zCreateUser } from "./createUser";
import zodSchema from "@zodyac/zod-mongoose";
import { zAthleteInfo } from "./athleteInfo";
import { zAddress } from "./address";

export type IUser = z.infer<typeof zUser> & {
  firebaseId: string;
};
export const zUser = zCreateUser.merge(zMongoDocument);

const infoSchema = zodSchema(zAthleteInfo);

const addressSchema = zodSchema(zAddress);

export const userSchema = new Schema<IUser>(
  {
    firebaseId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
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
    phone: {
      type: String,
    },
    phoneCode: {
      type: String,
    },
    info: infoSchema,
    address: addressSchema,
  },
  { timestamps: true }
);

export const UserModel = model<IUser>("User", userSchema);
