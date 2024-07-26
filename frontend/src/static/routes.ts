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
  "viewUser",
] as const;

export type Route = (typeof ROUTES)[number];

export type IRoute = {
  name: Route;
  label: string;
  href: string;
  permissions?: IRole[];
  inMenuFor?: IRole[];
  icon?: typeof IconChat | typeof DashboardIcon;
  backsTo?: Route;
};

export const ROUTE: Record<Route, IRoute> = {
  home: {
    href: "/",
    label: "Home",
    name: "home",
  },
  "sign-in": {
    href: "/sign-in",
    label: "Sign in",
    name: "sign-in",
  },
  dashboard: {
    href: "/dashboard",
    label: "Home",
    permissions: ["admin", "coach", "user"],
    inMenuFor: ["admin", "coach", "user"],
    icon: DashboardIcon,
    name: "dashboard",
  },
  users: {
    href: "/dashboard/users",
    label: "Users",
    permissions: ["admin", "coach"],
    inMenuFor: ["admin", "coach"],
    icon: PersonIcon,
    name: "users",
  },
  createUser: {
    href: "/dashboard/users/create",
    label: "Create User",
    permissions: ["admin", "coach"],
    backsTo: "users",
    name: "createUser",
  },
  editUser: {
    href: "/dashboard/users/edit",
    label: "Edit User",
    permissions: ["admin", "coach"],
    backsTo: "users",
    name: "editUser",
  },
  viewUser: {
    href: "/dashboard/users/view",
    label: "View User",
    permissions: ["admin", "coach"],
    backsTo: "users",
    name: "viewUser",
  },
  chat: {
    href: "/dashboard/chat",
    label: "Chat",
    permissions: [],
    inMenuFor: ["user"],
    icon: IconChat,
    name: "chat",
  },
  journal: {
    href: "/dashboard/journal",
    label: "Journal",
    permissions: [],
    inMenuFor: ["user"],
    icon: IconJournal,
    name: "journal",
  },
  profile: {
    href: "/dashboard/profile",
    label: "Profile",
    permissions: [],
    name: "profile",
    // inMenuFor: ["user", "admin", "coach"],
  },
  settings: {
    href: "/dashboard/settings",
    label: "Settings",
    permissions: [],
    inMenuFor: ["user", "admin", "coach"],
    icon: IconSettings,
    name: "settings",
  },
};

export const ROUTES_LIST: IRoute[] = Object.values(ROUTE);
