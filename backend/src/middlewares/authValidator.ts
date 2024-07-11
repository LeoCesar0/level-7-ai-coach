import { Context } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { getUserFromToken } from "../services/getUserFromToken";
import { IRole } from "../@schemas/roles";
import { IUser, UserModel } from "../routes/users/schemas/user";
import { ENV } from "@common/static/envs";

type IAuthValidator =
  | {
      permissionsTo?: IRole[];
    }
  | undefined;

const defaultV = {};

export const createVerifyAuthToken = ({
  permissionsTo,
}: IAuthValidator = defaultV) => {
  const verifyAuthToken: (
    token: string,
    ctx: Context
  ) => boolean | Promise<boolean> = async (token, ctx) => {
    try {
      let user: IUser | null = null;

      if (
        process.env.NODE_ENV === ENV.DEVELOPMENT ||
        process.env.NODE_ENV === ENV.TEST
      ) {
        // IN DEV OR TEST ENVS, USER ID CAN BE USED AS TOKEN
        user = (await UserModel.findById(token).catch((err) => {})) ?? null;
      }
      if (!user) {
        user = await getUserFromToken.exec({ token });
      }

      if (!user || (user && !user.active && user.role !== "admin")) {
        ctx.set("reqUser", null);
        return false;
      }

      if (permissionsTo) {
        const hasPermission = permissionsTo.includes(user.role);

        if (!hasPermission) {
          // Set status to 403
          ctx.set("forbiddenUser", true);
          return false;
        }
      }

      ctx.set("reqUser", user);

      return Boolean(user);
    } catch (err) {
      ctx.set("reqUser", null);
      return false;
    }
  };
  return verifyAuthToken;
};

export const authValidator = ({ permissionsTo }: IAuthValidator = defaultV) => {
  return bearerAuth({
    verifyToken: createVerifyAuthToken({ permissionsTo }),
    prefix: "Bearer",
  });
};
