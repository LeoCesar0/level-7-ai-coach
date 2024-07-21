import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zAthleteInfo } from "./athleteInfo";
import { zAddress } from "./address";
import { EXCEPTIONS } from "../../static/exceptions";
import { zRole } from "../roles";
import { zIsoDateOptional } from "../primitives/isoDate";

export type ICreateUser = z.infer<typeof zCreateUser>;

export const zCreateUser = z.object({
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  email: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("email") })
    .email(),
  phone: z.string().nullish(),
  phoneCode: z.string().nullish(),
  active: z.boolean().default(true),
  imageUrl: z.string().nullish(),
  role: zRole.default("user"),
  organization: z.string(),
  archetype: z.string().nullish(),
  address: zAddress.nullish(),
  birthday: zIsoDateOptional.nullish(),
  sport: z.string().nullish(),
  experience: z.string().nullish(),
  athleteInfo: zAthleteInfo.nullish(),
});
