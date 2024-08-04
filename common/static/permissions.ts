import type { IRole } from "../schemas/roles";
import type { IRouteApiAction } from "./methods";
import type { IApiRoute } from "./routes";

export type IPermissionRecord = Record<IApiRoute, IPermissionItem>;

export type IPermissionItem = {
  [key in IRouteApiAction | string]?: IRole[];
};

export const PERMISSION = {
  organizations: {
    get: ["user", "admin", "coach"],
    create: ["admin", "coach"],
    update: ["admin", "coach"],
    delete: ["admin", "coach"],
    list: ["admin", "user", "coach"],
    paginate: ["admin", "user", "coach"],
  },
  users: {
    get: ["admin", "coach"],
    create: ["admin", "coach"],
    update: ["admin", "coach"],
    delete: ["admin", "coach"],
    list: ["admin", "coach"],
    paginate: ["admin", "coach"],
    updateMe: ["admin", "coach", "user"],
    getMe: ["admin", "coach", "user"],
  },
  archetypes: {
    get: ["admin"],
    create: ["admin"],
    update: ["admin"],
    delete: ["admin"],
    list: ["admin"],
    paginate: ["admin"],
  },
  journals: {
    get: ["admin", "coach", "user"],
    create: ["user"],
    update: ["user"],
    delete: ["user"],
    paginate: ["admin", "user", "coach"],
  },
  chats: {
    get: ["admin", "coach", "user"],
    create: ["user"],
    update: ["user"],
    delete: ["user"],
    paginate: ["admin", "user", "coach"],
  },
} satisfies IPermissionRecord;
