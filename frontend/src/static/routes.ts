import type { IRole } from "@common/schemas/roles";
import { DashboardIcon, PersonIcon } from "@radix-icons/vue";
import IconChat from "@/components/icons/Chat.vue";
import IconJournal from "@/components/icons/Journal.vue";
import IconSettings from "@/components/icons/Settings.vue";
import {
  FlagIcon,
  BotMessageSquareIcon,
  BookUserIcon,
  UsersIcon,
  UserIcon,
  MedalIcon,
} from "lucide-vue-next";
import { PERMISSION } from "@common/static/permissions";

export const ROUTES = [
  "home",
  "sign-in",
  "athlete-form",
  "dashboard",
  "chats",
  "settings",
  "profile",
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
  // --------------------------
  // journals
  // --------------------------
  "journals",
  "createJournal",
  "editJournal",
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
  "athlete-form": {
    href: "/dashboard/athlete-form",
    label: "Athlete Form",
    name: "athlete-form",
    permissions: [],
  },
  chats: {
    href: "/dashboard/chat",
    label: "Chats",
    permissions: PERMISSION.chats.paginate,
    inMenuFor: ["user"],
    icon: IconChat,
    name: "chats",
  },

  // --------------------------
  // Users
  // --------------------------
  users: {
    href: "/dashboard/users",
    label: "Users",
    permissions: PERMISSION.users.paginate,
    inMenuFor: PERMISSION.users.paginate,
    icon: UsersIcon,
    name: "users",
  },
  createUser: {
    href: "/dashboard/users/create",
    label: "Create User",
    permissions: PERMISSION.users.create,
    backsTo: "users",
    name: "createUser",
  },
  editUser: {
    href: "/dashboard/users/edit",
    label: "Edit User",
    permissions: PERMISSION.users.update,
    backsTo: "users",
    name: "editUser",
  },
  viewUser: {
    href: "/dashboard/users/view",
    label: "View User",
    permissions: PERMISSION.users.get,
    backsTo: "users",
    name: "viewUser",
  },
  // --------------------------
  // Organizations
  // --------------------------
  organizations: {
    href: "/dashboard/organizations",
    label: "Teams",
    permissions: PERMISSION.organizations.paginate,
    inMenuFor: PERMISSION.organizations.paginate,
    icon: MedalIcon,
    name: "organizations",
  },
  createOrganization: {
    href: "/dashboard/organizations/create",
    label: "Create Team",
    permissions: PERMISSION.organizations.create,
    backsTo: "organizations",
    name: "createOrganization",
  },
  editOrganization: {
    href: "/dashboard/organizations/edit",
    label: "Edit Team",
    permissions: PERMISSION.organizations.update,
    backsTo: "organizations",
    name: "editOrganization",
  },
  viewOrganization: {
    href: "/dashboard/organizations/view",
    label: "View Team",
    permissions: PERMISSION.organizations.get,
    backsTo: "organizations",
    name: "viewOrganization",
  },
  // --------------------------
  // archetypes
  // --------------------------
  archetypes: {
    href: "/dashboard/archetypes",
    label: "Archetypes",
    permissions: PERMISSION.archetypes.paginate,
    inMenuFor: PERMISSION.archetypes.paginate,
    icon: BookUserIcon,
    name: "archetypes",
  },
  createArchetype: {
    href: "/dashboard/archetypes/create",
    label: "Create Archetype",
    permissions: PERMISSION.archetypes.create,
    backsTo: "archetypes",
    name: "createArchetype",
  },
  editArchetype: {
    href: "/dashboard/archetypes/edit",
    label: "Edit Archetype",
    permissions: PERMISSION.archetypes.update,
    backsTo: "archetypes",
    name: "editArchetype",
  },
  // --------------------------
  // journals
  // --------------------------
  journals: {
    href: "/dashboard/journals",
    label: "Journals",
    permissions: PERMISSION.journals.paginate,
    inMenuFor: ["user", "admin", "coach"],
    icon: IconJournal,
    name: "journals",
  },
  createJournal: {
    href: "/dashboard/journals/create",
    label: "Create Journal",
    permissions: PERMISSION.journals.create,
    backsTo: "journals",
    name: "createJournal",
  },
  editJournal: {
    href: "/dashboard/journals/edit",
    label: "Edit Journal",
    permissions: PERMISSION.journals.update,
    backsTo: "journals",
    name: "editJournal",
  },
  // --------------------------
  // other
  // --------------------------
  profile: {
    href: "/dashboard/profile",
    label: "Profile",
    permissions: PERMISSION.users.updateMe,
    inMenuFor: PERMISSION.users.updateMe,
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
