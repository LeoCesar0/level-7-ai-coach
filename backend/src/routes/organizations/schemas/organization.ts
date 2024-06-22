import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";
import { z } from "zod";
import { zId, zUUID, zodSchema } from "@zodyac/zod-mongoose";
import { MongoDocument, zMongoDocument } from "../../../@schemas/mongoose";
import { zRole } from "../../../@schemas/roles";
import { EXCEPTIONS } from "../../../static/exceptions";
import { ROLES_LIST } from "../../../static/roles";

export const zCreateOrganization = z.object({
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  users: z.array(zId.describe("ObjectId:User")),
});

export const zOrganization = zCreateOrganization.merge(zMongoDocument);

export type CreateOrganization = z.infer<typeof zCreateOrganization>;

export type Organization = z.infer<typeof zOrganization>;

export const organizationSchema = new Schema<Organization>(
  {
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

export const OrganizationModel = model<Organization>(
  "Organization",
  organizationSchema
);
