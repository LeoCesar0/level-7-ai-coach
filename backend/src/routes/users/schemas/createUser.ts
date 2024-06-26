import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zRole } from "../../../@schemas/roles";
import { EXCEPTIONS } from "../../../static/exceptions";
import { zAthleteInfo } from "./athleteInfo";

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
  phone: z.string().optional(),
  phoneCode: z.string().optional(),
  active: z.boolean().default(true),
  imageUrl: z.string().optional(),
  role: zRole.default("user"),
  organization: zId.describe("ObjectId:Organization"),
  address: z
    .object({
      city: z.string(),
      state: z.string(),
      country: z.string(),
      address: z.string(),
    })
    .optional(),
  info: zAthleteInfo.optional(),
});
