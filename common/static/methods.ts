export const ROUTE_METHODS = ["get", "post", "put", "delete"] as const;

// export const ROUTE_API_METHODS = [
//   "get",
//   "post",
//   "put",
//   "delete",
//   "me",
//   "list",
//   "paginate",
// ] as const;
export const ROUTE_API_ACTION_TYPES = [
  "get",
  "create",
  "update",
  "delete",
  "me",
  "list",
  "paginate",
] as const;

export type IRouteApiAction = (typeof ROUTE_API_ACTION_TYPES)[number];
export type IRouteMethod = (typeof ROUTE_METHODS)[number];
