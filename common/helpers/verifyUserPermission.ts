import type { IRole } from "@common/schemas/roles";
import type { IUser, IUserFull } from "@common/schemas/user/user";
import type { Nullish } from "@common/type/helpers";

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
