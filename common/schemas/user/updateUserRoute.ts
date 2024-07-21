import { z } from "zod";
import { zUser } from "./user";

export type IUpdateUserRoute = z.input<typeof updateUserRoute>;

export const updateUserRoute = zUser.partial();
