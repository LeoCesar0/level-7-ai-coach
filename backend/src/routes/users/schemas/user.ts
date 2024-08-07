import { Schema, model } from "mongoose";
import { z } from "zod";
import { ROLES_LIST } from "@common/static/roles";
import { zUserBase } from "@common/schemas/user/user";
import { zId } from "@zodyac/zod-mongoose";
import { zArchetype } from "@common/schemas/archetype/archetype";
import { zOrganization } from "@common/schemas/organization/organization";
import { IAddress } from "@common/schemas/user/address";
import { zMongoDocument } from "@/@schemas/mongo";

export type IUserDoc = z.infer<typeof zUserDoc>;

export type IUserFullDoc = z.infer<typeof zUserFullDoc>;

export const zUserDoc = zUserBase
  .merge(zMongoDocument)
  .omit({
    organization: true,
    archetype: true,
    birthDate: true,
  })
  .merge(
    z.object({
      organization: zId.describe("ObjectId:Organization"),
      archetype: zId.describe("ObjectId:Archetype").nullish(),
      birthDate: z.date().nullish(),
    })
  );

export const zUserFullDoc = zUserDoc
  .omit({ organization: true, archetype: true })
  .merge(
    z.object({
      archetype: zArchetype,
      organization: zOrganization,
    })
  );

const addressSchema = new Schema<IAddress>({
  city: { type: String },
  state: { type: String },
  country: { type: String },
  address: { type: String },
});

export const userSchema = new Schema<IUserDoc>(
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
    birthDate: {
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

export const UserModel = model<IUserDoc>("User", userSchema);
