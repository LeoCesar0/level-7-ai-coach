import { ROUTES_LIST, type IRoute } from "~/static/routes";

export const getCurrentRoute = () => {
  const route = useRoute();
  const strengthByRoute = new Map();

  const currentPage = ROUTES_LIST.reduce<IRoute | undefined>((acc, entry) => {
    if (entry.href === "/" && route.path !== "/") {
      return acc;
    }

    const strength = entry.href.split("/").length;
    strengthByRoute.set(entry.href, strength);

    const currentStrength = acc ? strengthByRoute.get(acc.href) : -1;

    if (route.path.includes(entry.href) && strength > currentStrength) {
      return entry;
    }

    return acc;
  }, undefined);

  return currentPage;
};
