import type { IRole } from "../schemas/roles";
import type { IRouteApiAction } from "./methods";
import type { IApiRoute } from "./routes";

export type IPermissionRecord = Record<IApiRoute, IPermissionItem>;

export type IPermissionItem = {
  [key in IRouteApiAction]?: IRole[];
};

export const PERMISSION = {
  organizations: {
    get: ["user", "admin", "coach"],
    create: ["admin", "coach"],
    update: ["admin", "coach"],
    delete: ["admin", "coach"],
    list: ["admin", "coach"],
    paginate: ["admin", "coach"],
  },
  users: {
    get: ["admin", "coach"],
    create: ["admin", "coach"],
    update: ["admin", "coach", "user"],
    delete: ["admin", "coach"],
    me: ["admin", "coach", "user"],
  },
} satisfies IPermissionRecord;
