import { ROUTE, type Route } from "~/static/routes";
import { getCurrentRoute } from "./getCurrentRoute";

export const getRouteBackToHref = (route: Route) => {
  const backToRoute = ROUTE[route].backsTo;
  if (!backToRoute) return undefined;
  return ROUTE[backToRoute].href;
};

export const getCurrentRouteBackToHref = () => {
  const currentRoute = getCurrentRoute();
  return currentRoute ? getRouteBackToHref(currentRoute.name) : undefined;
};
