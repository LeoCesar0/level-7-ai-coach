import type { ZodSchema } from "zod";
import { zCreateOrganization } from "../schemas/organization/createOrganization";
import { zUpdateOrganization } from "../schemas/organization/updateOrganization";
import type { IRouteApiAction, IRouteMethod } from "./methods";
import { zUpdateUser } from "../schemas/user/updateUserRoute";
import { zCreateArchetype } from "../schemas/archetype/createArchetype";
import { zUpdateArchetype } from "../schemas/archetype/updateArchetype";
import { zFilters } from "../schemas/pagination";
import z from "zod";
import { zCreateJournal } from "../schemas/journal/createJournal";
import { zUpdateJournal } from "../schemas/journal/updateJournal";
import { zCreateChat } from "../schemas/chat/create";
import { zCreateUserRoute } from "../schemas/user/createUserRoute";
import { type IRole } from "../schemas/roles";
import { zCreateMessage } from "../schemas/chat/createMessage";

const zPaginateRouteQueryInput = z
  .object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
    sortBy: z.string().nullish(),
    sortOrder: z.enum(["asc", "ascending", "desc", "descending"]).nullish(),
    filters: zFilters.nullish(),
    searchQuery: z.string().nullish(),
    searchFields: z.string().array().nullish(),
  })
  .default({
    limit: 10,
    page: 1,
  });

export const API_ROUTES = [
  "users",
  "organizations",
  "archetypes",
  "journals",
  "chats",
  "assessments",
] as const;

export type IApiRoute = (typeof API_ROUTES)[number];

export type IApiRouteActionItem = {
  baseUrl: string; // base
  path: string; // path after the baseUrl
  url: string | ((param: string) => string); // full url
  method: IRouteMethod;
  bodySchema?: ZodSchema;
  permissions?: IRole[];
};
export type IApiRouteActionSchema = {
  [key in IRouteApiAction | string]?: IApiRouteActionItem;
};
export type IApiRouteSchema = {
  [key in IApiRoute | string]?: IApiRouteActionSchema;
};

export const API_ROUTE = {
  organizations: {
    create: {
      baseUrl: "/organizations",
      url: "/organizations",
      path: "/",
      method: "post",
      bodySchema: zCreateOrganization,
      permissions: ["admin", "coach"],
    },
    update: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateOrganization,
      permissions: ["admin", "coach"],
    },
    delete: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "delete",
      permissions: ["admin", "coach"],
    },
    get: {
      baseUrl: "/organizations",
      url: (id: string) => `/organizations/${id}`,
      path: "/",
      method: "get",
      permissions: ["user", "admin", "coach"],
    },
    list: {
      baseUrl: "/organizations",
      url: "/organizations/list",
      path: "/list",
      method: "get",
      permissions: ["user", "admin", "coach"],
    },
    paginate: {
      baseUrl: "/organizations",
      url: "/organizations/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
      permissions: ["user", "admin", "coach"],
    },
  },
  users: {
    create: {
      baseUrl: "/users",
      url: "/users",
      path: "/",
      method: "post",
      bodySchema: zCreateUserRoute,
      permissions: ["admin", "coach"],
    },
    update: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateUser,
      permissions: ["admin", "coach"],
    },
    updateMe: {
      baseUrl: "/users",
      url: "/users/me",
      path: "/me",
      method: "put",
      bodySchema: zUpdateUser,
      permissions: ["user", "admin", "coach"],
    },
    getMe: {
      baseUrl: "/users",
      url: "/users",
      path: "/me",
      method: "get",
      permissions: ["user", "admin", "coach"],
    },
    get: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "get",
      permissions: ["admin", "coach"],
    },
    delete: {
      baseUrl: "/users",
      url: (id: string) => `/users/${id}`,
      path: "/",
      method: "delete",
      permissions: ["admin", "coach"],
    },
    list: {
      baseUrl: "/users",
      url: "/users/list",
      path: "/list",
      method: "get",
      permissions: ["admin", "coach"],
    },
    paginate: {
      baseUrl: "/users",
      url: "/users/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
      permissions: ["admin", "coach"],
    },
  },
  archetypes: {
    create: {
      baseUrl: "/archetypes",
      url: "/archetypes",
      path: "/",
      method: "post",
      bodySchema: zCreateArchetype,
      permissions: ["admin"],
    },
    update: {
      baseUrl: "/archetypes",
      url: (id: string) => `/archetypes/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateArchetype,
      permissions: ["admin"],
    },
    delete: {
      baseUrl: "/archetypes",
      url: (id: string) => `/archetypes/${id}`,
      path: "/",
      method: "delete",
      permissions: ["admin"],
    },
    get: {
      baseUrl: "/archetypes",
      url: (id: string) => `/archetypes/${id}`,
      path: "/",
      method: "get",
      permissions: ["admin"],
    },
    list: {
      baseUrl: "/archetypes",
      url: "/archetypes/list",
      path: "/list",
      method: "get",
      permissions: ["admin"],
    },
    paginate: {
      baseUrl: "/archetypes",
      url: "/archetypes/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
      permissions: ["admin"],
    },
  },
  journals: {
    create: {
      baseUrl: "/journals",
      url: "/journals",
      path: "/",
      method: "post",
      bodySchema: zCreateJournal,
      permissions: ["user"],
    },
    update: {
      baseUrl: "/journals",
      url: (id: string) => `/journals/${id}`,
      path: "/",
      method: "put",
      bodySchema: zUpdateJournal,
      permissions: ["user"],
    },
    delete: {
      baseUrl: "/journals",
      url: (id: string) => `/journals/${id}`,
      path: "/",
      method: "delete",
      permissions: ["user"],
    },
    get: {
      baseUrl: "/journals",
      url: (id: string) => `/journals/${id}`,
      path: "/",
      method: "get",
      permissions: ["admin", "coach", "user"],
    },
    paginate: {
      baseUrl: "/journals",
      url: "/journals/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
      permissions: ["admin", "coach", "user"],
    },
  },
  chats: {
    create: {
      baseUrl: "/chats",
      url: "/chats",
      path: "/",
      method: "post",
      bodySchema: zCreateChat,
      permissions: ["admin", "coach", "user"],
    },
    delete: {
      baseUrl: "/chats",
      url: (id: string) => `/chats/${id}`,
      path: "/",
      method: "delete",
      permissions: ["admin", "coach", "user"],
    },
    get: {
      baseUrl: "/chats",
      url: (id: string) => `/chats/${id}`,
      path: "/",
      method: "get",
      permissions: ["admin", "coach", "user"],
    },
    paginate: {
      baseUrl: "/chats",
      url: "/chats/paginate",
      path: "/paginate",
      method: "get",
      bodySchema: zPaginateRouteQueryInput,
      permissions: ["admin", "coach", "user"],
    },
    send: {
      baseUrl: "/chats",
      url: "/chats/send",
      path: "/send",
      method: "post",
      bodySchema: zCreateMessage,
      permissions: ["admin", "coach", "user"],
    },
    history: {
      baseUrl: "/chats",
      url: "/chats/history",
      path: "/history",
      method: "get",
      permissions: ["admin", "coach", "user"],
    },
  },
  assessments: {
    "process-journals": {
      baseUrl: "/assessments",
      url: "/assessments/process-journals",
      path: "/process-journals",
      method: "post",
      permissions: ["admin"],
    },
    "process-chats": {
      baseUrl: "/assessments",
      url: "/assessments/process-chats",
      path: "/process-chats",
      method: "post",
      permissions: ["admin"],
    },
    paginate: {
      baseUrl: "/assessments",
      url: "/assessments/paginate",
      path: "/paginate",
      method: "post",
      permissions: ["admin", "coach"],
    },
  },
} satisfies IApiRouteSchema;
