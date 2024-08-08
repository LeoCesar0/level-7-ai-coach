import { ROUTES_LIST, type IRoute } from "~/static/routes";

export const getCurrentRoute = () => {
  const route = useRoute();
  const matchesByRoute = new Map();

  const currentPage = ROUTES_LIST.reduce<IRoute | undefined>((acc, entry) => {
    if (entry.href === "/" && route.path !== "/") {
      return acc;
    }

    const entrySplit = entry.href.split("/");
    const routeSplits = route.path.split("/");

    let nMatches = 0;

    for (const item of routeSplits) {
      if (entrySplit.find((_item) => _item === item)) {
        nMatches += 1;
      }
    }
    matchesByRoute.set(entry.href, nMatches);

    const currentMaxMatch = acc ? matchesByRoute.get(acc.href) : -1;

    if (nMatches > currentMaxMatch) {
      return entry;
    }

    return acc;
  }, undefined);

  return currentPage;
};
