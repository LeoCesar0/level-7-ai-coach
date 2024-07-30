import type { IRole } from "../schemas/roles";
import type { IUser, IUserFull } from "../schemas/user/user";
import type { Nullish } from "../type/helpers";

export const verifyUserPermission = ({
  user,
  routePermissions,
}: {
  user: Nullish<IUser | IUserFull>;
  routePermissions: IRole[] | undefined;
}) => {
  if (!user) return false;
  if (!routePermissions) {
    return true;
  }
  return routePermissions.includes(user.role);
};
