import { z } from "zod";
import { zAthleteInfo } from "./athleteInfo";
import { zAddress } from "./address";
import { EXCEPTIONS } from "../../static/exceptions";
import { zRole } from "../roles";
import { zIsoDateOptional } from "../primitives/isoDate";

export type ICreateUser = z.input<typeof zCreateUser>;

export const zCreateUser = z.object({
  _id: z.string().optional(),
  active: z.boolean().default(true),
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  email: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("email") })
    .email(),
  organization: z.string(),
  role: zRole.default("user"),
  phoneCode: z.string().nullish(),
  phone: z.string().nullish(),
  imageUrl: z.string().nullish(),
  birthDate: zIsoDateOptional.nullish(),
  address: zAddress.nullish(),
  athleteInfo: zAthleteInfo.nullish(),
  archetype: z.string().nullish(),
});
