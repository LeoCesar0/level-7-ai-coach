import { z } from "zod";
import { zUser } from "./user";

export type IUpdateUser = z.input<typeof zUpdateUser>;

export const zUpdateUser = zUser.partial();
