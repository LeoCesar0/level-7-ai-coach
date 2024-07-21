import { z } from "zod";
import { zCreateUser } from "./createUser";
import { zMongoDocumentClient } from "../mongo";
import { zArchetype } from "../archetype/archetype";
import { zOrganization } from "../organization/organization";

export const zUserBase = zCreateUser.merge(
  z.object({
    firebaseId: z.string(),
  })
);

export type IUser = z.infer<typeof zUser>;
export const zUser = zUserBase.merge(zMongoDocumentClient);

export type IUserFull = z.infer<typeof zUserFull>;
export const zUserFull = zUser
  .omit({ organization: true, archetype: true })
  .merge(
    z.object({
      archetype: zArchetype,
      organization: zOrganization,
    })
  );
