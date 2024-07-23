import type { IRole } from "@common/schemas/roles";
import { DashboardIcon, PersonIcon } from "@radix-icons/vue";
import IconChat from "@/components/icons/Chat.vue";
import IconJournal from "@/components/icons/Journal.vue";
import IconSettings from "@/components/icons/Settings.vue";

export const ROUTES = [
  "home",
  "sign-in",
  "dashboard",
  "chat",
  "settings",
  "profile",
  "journal",
  "users",
  "createUser",
  "editUser",
] as const;

export type Route = (typeof ROUTES)[number];

export type IRoute = {
  label: string;
  href: string;
  permissions?: IRole[];
  inMenuFor?: IRole[];
  icon?: typeof IconChat | typeof DashboardIcon;
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
    label: "Home",
    permissions: ["admin", "coach", "user"],
    inMenuFor: ["admin", "coach", "user"],
    icon: DashboardIcon,
  },
  users: {
    href: "/dashboard/users",
    label: "Users",
    permissions: ["admin", "coach"],
    inMenuFor: ["admin", "coach"],
    icon: PersonIcon,
  },
  createUser: {
    href: "/dashboard/users/create",
    label: "Users",
    permissions: ["admin", "coach"],
  },
  editUser: {
    href: "/dashboard/users/edit",
    label: "Users",
    permissions: ["admin", "coach"],
  },
  chat: {
    href: "/dashboard/chat",
    label: "Chat",
    permissions: [],
    inMenuFor: ["user"],
    icon: IconChat,
  },
  journal: {
    href: "/dashboard/journal",
    label: "Journal",
    permissions: [],
    inMenuFor: ["user"],
    icon: IconJournal,
  },
  profile: {
    href: "/dashboard/profile",
    label: "Profile",
    permissions: [],
    // inMenuFor: ["user", "admin", "coach"],
  },

  settings: {
    href: "/dashboard/settings",
    label: "Settings",
    permissions: [],
    inMenuFor: ["user", "admin", "coach"],
    icon: IconSettings,
  },
};

export const ROUTES_LIST: IRoute[] = Object.values(ROUTE);
