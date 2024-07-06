import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zRole } from "../../../@schemas/roles";
import { EXCEPTIONS } from "../../../static/exceptions";
import { zAthleteInfo } from "./athleteInfo";
import { zAddress } from "./address";
import { zIsoDate } from "../../../@schemas/primitives/isoDate";

export type ICreateUser = z.infer<typeof zCreateUser>;

export const zCreateUser = z.object({
  _id: z.string().optional(),
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  email: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("email") })
    .email(),
  phone: z.string().optional(),
  phoneCode: z.string().optional(),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  role: zRole.default("user"),
  organization: zId.describe("ObjectId:Organization"),
  archetype: zId.describe("ObjectId:Archetype").optional(),
  address: zAddress.optional(),
  birthday: zIsoDate.optional(),
  sport: z.string().optional(),
  experience: z.string().optional(),
  athleteInfo: zAthleteInfo.optional(),
});
