import { type IUser, type IUserFull } from "../schemas/user/user";
import type { Nullish } from "../type/helpers";
import { verifyUserPermission } from "./verifyUserPermission";
import type { IRouteApiAction } from "../static/methods";
import type { IPermissionItem } from "../static/permissions";
import { verifyMutatePermission } from "./verifyMutatePermission";
import type { IRole } from "@common/schemas/roles";

export const verifyRoutePermission = ({
  user,
  permissions,
}: {
  user: Nullish<IUser | IUserFull>;
  permissions?: IRole[];
}) => {
  const permissionToRoute = verifyUserPermission({
    user,
    routePermissions: permissions,
  });

  if (!permissionToRoute) {
    return false;
  }

  return true;
};
