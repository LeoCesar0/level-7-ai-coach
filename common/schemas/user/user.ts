import { zStringOnlyNumbers } from "./../primitives/stringOnlyNumbers";
import { z } from "zod";
import { zCreateUser } from "./createUser";
import { zMongoDocumentClient } from "../mongo";
import { zArchetype } from "../archetype/archetype";
import { zOrganization } from "../organization/organization";
import { EXCEPTIONS } from "@common/static/exceptions";
import { zRole } from "../roles";
import { zAddress } from "./address";
import { zAthleteInfo } from "./athleteInfo";
import { zStringOnlyDigits } from "../primitives/stringOnlyDigits";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";

export const zUserBase = z.object({
  firebaseId: z.string(),
  active: z.boolean().default(true),
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  email: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("email") })
    .email(),
  organization: zStringNotEmpty,
  role: zRole.default("user"),
  phoneCode: zStringOnlyDigits.nullish(),
  phone: zStringOnlyNumbers.nullish(),
  imageUrl: z.string().nullish(),
  birthDate: z.coerce.date().nullish(),
  address: zAddress.nullish(),
  athleteInfo: zAthleteInfo.nullish(),
  archetype: zStringNotEmpty.nullish(),
});

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
