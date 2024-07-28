import type { ZodSchema } from "zod";
import { zCreateOrganization } from "../schemas/organization/createOrganization";
import { zUpdateOrganization } from "../schemas/organization/updateOrganization";
import type { IRouteApiAction, IRouteMethod } from "./methods";
import { zCreateUser } from "../schemas/user/createUser";
import { zUpdateUser } from "../schemas/user/updateUserRoute";
import { zPaginateRouteQueryInput } from "../schemas/paginateRoute";

export const API_ROUTES = [
  // --------------------------
  // users
  // --------------------------
  "users",
  // --------------------------
  // orgs
  // --------------------------
  "organizations",
] as const;

export type IApiRoute = (typeof API_ROUTES)[number];
//TODO

export const API_ROUTE_PATH = {
  organizations: "/organizations",
  organizationsPaginate: "/organizations/paginate",
  organizationsList: "/organizations/list",
  users: "/users",
  usersPaginate: "/users/paginate",
  usersList: "/users/list",
};

export type IApiRouteActionItem = {
  baseUrl: string; // base
  path: string; // path after the baseUrl
  url: string | ((param: string) => string); // full url
  method: IRouteMethod;
  bodySchema?: ZodSchema;
};
export type IApiRouteActionSchema = {
  [key in IRouteApiAction]?: IApiRouteActionItem;
};
export type IApiRouteSchema = Record<IApiRoute, IApiRouteActionSchema>;

export const API_ROUTE = {
  organizations: {
    create: {
      baseUrl: "/organizations",
      url: "/organizations",
      path: "/",
      method: "post",
      bodySchema: zCreateOrganization,
    },
    update: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateOrganization,
    },
    delete: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "delete",
    },
    get: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "get",
    },
    list: {
      baseUrl: "/organizations",
      url: "/organizations/list",
      path: "/list",
      method: "get",
    },
    paginate: {
      baseUrl: "/organizations",
      url: "/organizations/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
    },
  },
  users: {
    create: {
      baseUrl: "/users",
      url: "/users",
      path: "/",
      method: "post",
      bodySchema: zCreateUser,
    },
    update: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateUser,
    },
    get: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "get",
    },
    delete: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "delete",
    },
    list: {
      baseUrl: "/users",
      url: "/users/list",
      path: "/list",
      method: "get",
    },
    paginate: {
      baseUrl: "/users",
      url: "/users/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
    },
  },
} satisfies IApiRouteSchema;
