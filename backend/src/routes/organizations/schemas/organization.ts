import { Schema, model } from "mongoose";
import { z } from "zod";
import { zId, zodSchema } from "@zodyac/zod-mongoose";
import { zMongoDocument } from "../../../@schemas/mongoose";
import { EXCEPTIONS } from "../../../static/exceptions";
import { zCreateOrganization } from "./createOrganization";
import { slugify } from "../../../helpers/slugify";

export type Organization = z.infer<typeof zOrganization>;

export const zOrganization = zCreateOrganization
  .merge(
    z.object({
      active: z.boolean().default(true),
      slug: z.string(),
    })
  )
  .merge(zMongoDocument);

export const organizationSchema = new Schema<Organization>(
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
organizationSchema.pre("save", function (next) {
  this.slug = slugify(this.name) || "";
  next();
});

export const OrganizationModel = model<Organization>(
  "Organization",
  organizationSchema
);
