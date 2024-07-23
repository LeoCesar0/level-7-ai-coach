import { z } from "zod";
import { zUserBase } from "./user";

export type ICreateUser = z.input<typeof zCreateUser>;

export const zCreateUser = zUserBase.omit({
  firebaseId: true,
  active: true,
  archetype: true,
});
