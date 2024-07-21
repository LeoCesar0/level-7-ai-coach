import { Schema, model } from "mongoose";
import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { slugify } from "../../../helpers/slugify";
import { zOrganizationBase } from "@common/schemas/organization/organization";

export const zOrganizationDoc = zOrganizationBase.omit({ users: true }).merge(
  z.object({
    users: z.array(zId.describe("ObjectId:User")),
  })
);
export type IOrganizationDoc = z.infer<typeof zOrganizationDoc>;

export const organizationSchema = new Schema<IOrganizationDoc>(
  {
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
    },
    active: {
      type: Boolean,
      default: true,
    },
    adminOrganization: {
      type: Boolean,
    },
    imageUrl: {
      type: String,
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
// --------------------------
// MIDDLEWARES
// --------------------------
organizationSchema.pre("save", async function (next) {
  this.slug = slugify(this.name) || "";
  next();
});
organizationSchema.pre("updateOne", async function (next) {
  const modifiedFields = this.getUpdate() as any;
  if (modifiedFields.name) {
    const slug = slugify(modifiedFields.name);
    this.set({ slug: slug });
  }
  next();
});

// organizationSchema.post("save", async function (doc, next) {
//   if (doc.users.length) {
//     await UserModel.updateMany(
//       { _id: { $in: doc.users } }, // Filter users that are part of the organization
//       { $set: { organization: doc._id } } // Set the new organizationId for each user
//     );
//   }
//   next();
// });

// organizationSchema.post("updateOne", async function (_, next) {
//   const modifiedFields = this.getUpdate() as any;

//   if (modifiedFields.users && Array.isArray(modifiedFields.users)) {
//     const docToUpdate = (await this.model.findOne(
//       this.getQuery()
//     )) as Organization;
//     const organizationId = docToUpdate._id;
//     await UserModel.updateMany(
//       { _id: { $in: modifiedFields.users } }, // Filter users that are part of the organization
//       { $set: { organization: organizationId } } // Set the new organizationId for each user
//     );
//   }
//   next();
// });

// --------------------------
// MODEL
// --------------------------

export const OrganizationModel = model<IOrganizationDoc>(
  "Organization",
  organizationSchema
);
