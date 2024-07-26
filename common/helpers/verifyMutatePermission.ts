import {
  zOrganization,
  type IOrganization,
} from "@common/schemas/organization/organization";
import type { IRole } from "@common/schemas/roles";
import {
  zUser,
  zUserFull,
  type IUser,
  type IUserFull,
} from "@common/schemas/user/user";
import type { Nullish } from "@common/type/helpers";
import { verifyUserPermission } from "./verifyUserPermission";
import type { IApiRoutes } from "@common/static/routes";
import type {
  IRouteApiMethod,
  IRouteMutationMethod,
} from "@common/static/methods";
import type { IPermissionItem } from "@common/static/permissions";

export const itemIsUser = (item: any): item is IUser | IUserFull => {
  return zUser.safeParse(item).success || zUserFull.safeParse(item).success;
};

export const itemIsOrg = (item: any): item is IOrganization => {
  return zOrganization.safeParse(item).success;
};

export const itemIsOrgAdmin = (item: any): item is IOrganization => {
  const isOrg = itemIsOrg(item);
  if (!isOrg) return false;
  return !!item.adminOrganization;
};

export const verifyMutatePermission = ({
  user,
  routePermissions,
  item,
  method,
}: {
  user: Nullish<IUser | IUserFull>;
  routePermissions: IPermissionItem;
  item: Record<string, any>;
  method: IRouteMutationMethod;
}) => {
  const permissions = routePermissions[method];
  const permissionToRoute = verifyUserPermission({
    user,
    routePermissions: permissions,
  });

  if (!permissionToRoute) {
    return false;
  }
  if (itemIsOrgAdmin(item)) {
    // TRYING TO MUTATE ADMIN ORG
    return false;
  }
  if (itemIsUser(item) && item.role === "admin") {
    // TRYING TO MUTATE ADMIN
    return false;
  }
  if (itemIsUser(item) && item.role === "coach" && item._id !== user?._id) {
    return false;
  }
  return true;
};
