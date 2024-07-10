export const ROUTES = ["home", "sign-in", "dashboard"] as const;

export type Route = (typeof ROUTES)[number];

type IRoute = {
  label: string;
  href: string;
};

export const ROUTE: Record<Route, IRoute> = {
  home: {
    href: "/",
    label: "Home",
  },
  "sign-in": {
    href: "/sign-in",
    label: "Sign in",
  },
  dashboard: {
    href: "/dashboard",
    label: "Dashboard",
  },
};
