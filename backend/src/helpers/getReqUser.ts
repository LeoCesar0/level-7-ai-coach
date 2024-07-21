import { IUserDoc } from "@/routes/users/schemas/user";
import { IUser } from "@common/schemas/user";
import { Context } from "hono";

export const getReqUser = (ctx: Context) => {
  const reqUser: IUserDoc | undefined = ctx.get("reqUser");
  if (!reqUser) return null;
  return reqUser;
};
