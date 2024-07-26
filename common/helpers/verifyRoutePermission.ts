import { type IUser, type IUserFull } from "@common/schemas/user/user";
import type { Nullish } from "@common/type/helpers";
import { verifyUserPermission } from "./verifyUserPermission";
import type {
  IRouteApiMethod,
  IRouteMutationMethod,
} from "@common/static/methods";
import type { IPermissionItem } from "@common/static/permissions";
import { verifyMutatePermission } from "./verifyMutatePermission";

export const verifyRoutePermission = ({
  user,
  routePermissions,
  item,
  method,
}: {
  user: Nullish<IUser | IUserFull>;
  routePermissions: IPermissionItem;
  item: Record<string, any>;
  method: IRouteApiMethod;
}) => {
  const isMutating =
    method === "post" || method === "put" || method === "delete";
  if (isMutating) {
    return verifyMutatePermission({
      item,
      method: method as IRouteMutationMethod,
      routePermissions,
      user,
    });
  }

  const permissions = routePermissions[method];
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
