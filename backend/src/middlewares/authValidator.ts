import { Context } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { TEST_CONFIG } from "../../tests/config";
import { ENV } from "../static/envs";
import { getUserFromToken } from "../services/getUserFromToken";
import { Role } from "../@schemas/roles";

type IAuthValidator =
  | {
      permissionsTo?: Role[];
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
    if (
      process.env.NODE_ENV === ENV.TEST &&
      token === TEST_CONFIG.VALID_TOKEN
    ) {
      return true;
    }

    const user = await getUserFromToken.exec({ token });

    if (user && !user.active) return false;

    if (permissionsTo && user) {
      const hasPermission = permissionsTo.includes(user.role);

      if (!hasPermission) {
        return false;
      }
    }

    if (user) {
      ctx.set("reqUser", user);
    }

    return Boolean(user);
  };
  return verifyAuthToken;
};

export const authValidator = ({ permissionsTo }: IAuthValidator = defaultV) => {
  return bearerAuth({
    verifyToken: createVerifyAuthToken({ permissionsTo }),
    prefix: "Bearer",
  });
};
