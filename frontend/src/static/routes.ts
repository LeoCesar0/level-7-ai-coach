import type { IRole } from "@common/schemas/roles";
import { DashboardIcon, PersonIcon } from "@radix-icons/vue";
import IconChat from "@/components/icons/Chat.vue";
import IconJournal from "@/components/icons/Journal.vue";
import IconSettings from "@/components/icons/Settings.vue";
import {
  FlagIcon,
  AntennaIcon,
  UsersIcon,
  UserIcon,
  MedalIcon,
} from "lucide-vue-next";

export const ROUTES = [
  "home",
  "sign-in",
  "dashboard",
  "chat",
  "settings",
  "profile",
  "journal",
  // --------------------------
  // users
  // --------------------------
  "users",
  "createUser",
  "editUser",
  "viewUser",
  // --------------------------
  // orgs
  // --------------------------
  "organizations",
  "createOrganization",
  "editOrganization",
  "viewOrganization",
  // --------------------------
  // archetypes
  // --------------------------
  "archetypes",
  "createArchetype",
  "editArchetype",
  "viewArchetype",
] as const;

export type Route = (typeof ROUTES)[number];

export type IRoute = {
  name: Route;
  label: string;
  href: string;
  permissions?: IRole[]; // undefined means no permission required, empty list means any authenticated user can access
  inMenuFor?: IRole[];
  icon?: typeof IconChat | typeof DashboardIcon | typeof UsersIcon;
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

  // --------------------------
  // Users
  // --------------------------
  users: {
    href: "/dashboard/users",
    label: "Users",
    permissions: ["admin", "coach"],
    inMenuFor: ["admin", "coach"],
    icon: UsersIcon,
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
  // --------------------------
  // Organizations
  // --------------------------
  organizations: {
    href: "/dashboard/organizations",
    label: "Teams",
    permissions: ["admin", "coach"],
    inMenuFor: ["admin", "coach"],
    icon: MedalIcon,
    name: "organizations",
  },
  createOrganization: {
    href: "/dashboard/organizations/create",
    label: "Create Team",
    permissions: ["admin", "coach"],
    backsTo: "organizations",
    name: "createOrganization",
  },
  editOrganization: {
    href: "/dashboard/organizations/edit",
    label: "Edit Team",
    permissions: ["admin", "coach"],
    backsTo: "organizations",
    name: "editOrganization",
  },
  viewOrganization: {
    href: "/dashboard/organizations/view",
    label: "View Team",
    permissions: ["admin", "coach"],
    backsTo: "organizations",
    name: "viewOrganization",
  },
  // --------------------------
  // archetypes
  // --------------------------
  archetypes: {
    href: "/dashboard/archetypes",
    label: "Archetypes",
    permissions: ["admin"],
    inMenuFor: ["admin"],
    icon: AntennaIcon,
    name: "archetypes",
  },
  createArchetype: {
    href: "/dashboard/archetypes/create",
    label: "Create Archetype",
    permissions: ["admin"],
    backsTo: "archetypes",
    name: "createArchetype",
  },
  editArchetype: {
    href: "/dashboard/archetypes/edit",
    label: "Edit Archetype",
    permissions: ["admin"],
    backsTo: "archetypes",
    name: "editArchetype",
  },
  viewArchetype: {
    href: "/dashboard/archetypes/view",
    label: "View Archetype",
    permissions: ["admin"],
    backsTo: "archetypes",
    name: "viewArchetype",
  },
  // --------------------------
  // other
  // --------------------------
  profile: {
    href: "/dashboard/profile",
    label: "Profile",
    permissions: [],
    inMenuFor: ["user", "admin", "coach"],
    name: "profile",
    icon: UserIcon,
  },
  settings: {
    href: "/dashboard/settings",
    label: "Settings",
    permissions: [],
    // inMenuFor: ["user", "admin", "coach"],
    icon: IconSettings,
    name: "settings",
  },
};

export const ROUTES_LIST: IRoute[] = Object.values(ROUTE);
