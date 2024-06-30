import { z } from "zod";
import { EXCEPTIONS } from "../../../static/exceptions";

export type ICreateOrganization = z.infer<typeof zCreateOrganization>;

export const zCreateOrganization = z.object({
  name: z
    .string()
    .min(1, { message: EXCEPTIONS.FIELD_REQUIRED("name") })
    .max(255),
  imageUrl: z.string().optional(),
});
