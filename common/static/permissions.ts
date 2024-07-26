import type { IRole } from "@common/schemas/roles";
import type { IRouteApiMethod, IRouteMethod } from "./methods";
import type { IApiRoutes } from "./routes";

export type IPermissionRecord = Record<IApiRoutes, IPermissionItem>;

export type IPermissionItem = {
  [key in IRouteApiMethod]?: IRole[];
};

export const PERMISSION = {
  organizations: {
    get: ["user", "admin", "coach"],
    post: ["admin", "coach"],
    put: ["admin", "coach"],
    delete: ["admin", "coach"],
    list: ["admin", "coach"],
    paginate: ["admin", "coach"],
  },
  users: {
    get: ["admin", "coach"],
    post: ["admin", "coach"],
    put: ["admin", "coach", "user"],
    delete: ["admin", "coach"],
    me: ["admin", "coach", "user"],
  },
} satisfies IPermissionRecord;
