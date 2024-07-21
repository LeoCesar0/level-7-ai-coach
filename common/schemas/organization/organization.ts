import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zCreateOrganization } from "./createOrganization";
import { zMongoDocumentClient } from "../mongo";

export type IOrganization = z.infer<typeof zOrganization>;

export const zOrganizationBase = zCreateOrganization.merge(
  z.object({
    active: z.boolean().default(true),
    slug: z.string(),
    adminOrganization: z.boolean().optional(),
  })
);

export const zOrganization = zOrganizationBase.merge(zMongoDocumentClient);
