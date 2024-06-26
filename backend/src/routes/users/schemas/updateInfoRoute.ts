import { z } from "zod";
import { zAthleteInfo } from "./athleteInfo";

export const updateUserInfoRoute = z.object({
  info: zAthleteInfo,
  userId: z.string().min(1),
});

export type IUpdateUserInfoRoute = z.input<typeof updateUserInfoRoute>;
