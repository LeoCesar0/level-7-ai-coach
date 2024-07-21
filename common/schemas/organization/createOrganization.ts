import { z } from "zod";
import { EXCEPTIONS } from "../../static/exceptions";
import { zStringNotEmpty } from "../primitives/stringNotEmpty";

export type ICreateOrganization = z.input<typeof zCreateOrganization>;

export const zCreateOrganization = z.object({
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  imageUrl: z.string().nullish(),
  users: z.array(zStringNotEmpty).optional().default([]),
});
