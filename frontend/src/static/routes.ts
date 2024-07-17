import type { IRole } from "@common/schemas/roles";
import {
  ChatBubbleIcon,
  GearIcon,
  PaperPlaneIcon,
  DashboardIcon,
} from "@radix-icons/vue";
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
    label: "Dashboard",
    permissions: ["admin", "coach", "user"],
    icon: DashboardIcon,
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
