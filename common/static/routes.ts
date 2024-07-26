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

export type IApiRoutes = (typeof API_ROUTES)[number];
//TODO
