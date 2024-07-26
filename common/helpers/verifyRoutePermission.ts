import { type IUser, type IUserFull } from "@common/schemas/user/user";
import type { Nullish } from "@common/type/helpers";
import { verifyUserPermission } from "./verifyUserPermission";
import type { IRouteApiAction } from "@common/static/methods";
import type { IPermissionItem } from "@common/static/permissions";
import { verifyMutatePermission } from "./verifyMutatePermission";

export const verifyRoutePermission = ({
  user,
  routePermissions,
  item,
  action,
}: {
  user: Nullish<IUser | IUserFull>;
  routePermissions: IPermissionItem;
  item: Record<string, any>;
  action: IRouteApiAction;
}) => {
  const isMutating =
    action === "create" || action === "update" || action === "delete";
  if (isMutating) {
    return verifyMutatePermission({
      item,
      action,
      routePermissions,
      user,
    });
  }

  const permissions = routePermissions[action];
  const permissionToRoute = verifyUserPermission({
    user,
    routePermissions: permissions,
  });

  if (!permissionToRoute) {
    return false;
  }

  if (!isMutating) {
    return permissionToRoute;
  }

  return true;
};
