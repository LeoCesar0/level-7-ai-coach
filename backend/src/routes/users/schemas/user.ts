import { Schema, model } from "mongoose";
import { z } from "zod";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { ROLES_LIST } from "@common/static/roles";
import { zCreateUser } from "./createUser";
import { IAddress, zAddress } from "./address";
import { zArchetype } from "../../archetype/schemas/archetype";
import { zOrganization } from "../../organizations/schemas/organization";
import { zodSchema } from "@zodyac/zod-mongoose";

export type IUser = z.infer<typeof zUser> & {
  firebaseId: string;
};

export type IUserFull = z.infer<typeof zUserFull>;

export const zUser = zCreateUser.merge(zMongoDocument);

export const zUserFull = zUser
  .omit({ organization: true, archetype: true })
  .merge(
    z.object({
      firebaseId: z.string(),
      archetype: zArchetype,
      organization: zOrganization,
    })
  );

const addressSchema = new Schema<IAddress>({
  city: { type: String, required: true },
  state: { type: String, required: true },
  country: { type: String, required: true },
  address: { type: String, required: true },
});

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
    archetype: {
      type: Schema.Types.ObjectId,
      ref: "Archetype",
    },
    phone: {
      type: String,
    },
    phoneCode: {
      type: String,
    },
    athleteInfo: {},
    birthday: {
      type: String,
    },
    sport: {
      type: String,
    },
    experience: {
      type: String,
    },
    address: addressSchema,
  },
  { timestamps: true }
);

// userSchema.pre("save", async function (next) {
//   if (this.organization) {
//     await OrganizationModel.updateMany(
//       { _id: { $in: this.organization } },
//       { $addToSet: { users: this._id } }
//     );
//   }
//   next();
// });

export const UserModel = model<IUser>("User", userSchema);
