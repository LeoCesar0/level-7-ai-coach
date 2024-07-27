import { zOrganization } from "./organization";
import z from "zod";

export const zUpdateOrganization = zOrganization.partial();

export type IUpdateOrganization = z.infer<typeof zUpdateOrganization>;
