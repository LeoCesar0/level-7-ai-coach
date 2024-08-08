import { ROUTE, type IRoute, type Route } from "~/static/routes";
import { getCurrentRoute } from "./getCurrentRoute";

export const getRouteBackToHref = (route: Route) => {
  const backToRoute = (ROUTE[route] as IRoute)?.backsTo;
  if (!backToRoute) return undefined;
  return ROUTE[backToRoute].href;
};

export const getCurrentRouteBackToHref = () => {
  const currentRoute = getCurrentRoute();
  return currentRoute ? getRouteBackToHref(currentRoute.name) : undefined;
};
