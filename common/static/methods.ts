export const ROUTE_METHODS = ["get", "post", "put", "delete"] as const;

export const ROUTE_API_METHODS = [
  "get",
  "post",
  "put",
  "delete",
  "me",
  "list",
  "paginate",
] as const;

export const ROUTE_MUTATE_METHODS = ["get", "post", "put"] as const;

export type IRouteApiMethod = (typeof ROUTE_API_METHODS)[number];
export type IRouteMethod = (typeof ROUTE_METHODS)[number];
export type IRouteMutationMethod = (typeof ROUTE_MUTATE_METHODS)[number];
