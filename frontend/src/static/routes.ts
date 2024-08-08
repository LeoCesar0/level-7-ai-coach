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
  BarChartIcon,
} from "lucide-vue-next";
import { API_ROUTE } from "@common/static/routes";

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
  "userAssessments",
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
  // --------------------------
  // assessment
  // --------------------------
  "assessments",
] as const;

export type Route = (typeof ROUTES)[number];

export type AppIcon = typeof IconChat | typeof DashboardIcon | typeof UsersIcon;

export type IRoute = {
  name: Route;
  label: string;
  href: string;
  permissions?: IRole[]; // undefined means no permission required, empty list means any authenticated user can access
  inMenuFor?: IRole[];
  icon?: AppIcon;
  backsTo?: Route;
};

export const ROUTE = {
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
    permissions: API_ROUTE.chats.paginate.permissions,
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
    permissions: API_ROUTE.users.paginate.permissions,
    inMenuFor: API_ROUTE.users.paginate.permissions,
    icon: UsersIcon,
    name: "users",
  },
  userAssessments: {
    href: `/dashboard/users/[id]/assessments`,
    label: "User Assessments",
    permissions: API_ROUTE.assessments.paginate.permissions,
    name: "userAssessments",
    backsTo: "users",
  },
  createUser: {
    href: "/dashboard/users/create",
    label: "Create User",
    permissions: API_ROUTE.users.create.permissions,
    backsTo: "users",
    name: "createUser",
  },
  editUser: {
    href: "/dashboard/users/edit",
    label: "Edit User",
    permissions: API_ROUTE.users.update.permissions,
    backsTo: "users",
    name: "editUser",
  },
  viewUser: {
    href: "/dashboard/users/view",
    label: "View User",
    permissions: API_ROUTE.users.get.permissions,
    backsTo: "users",
    name: "viewUser",
  },
  // --------------------------
  // Organizations
  // --------------------------
  organizations: {
    href: "/dashboard/organizations",
    label: "Teams",
    permissions: API_ROUTE.organizations.paginate.permissions,
    inMenuFor: ["admin"],
    icon: MedalIcon,
    name: "organizations",
  },
  createOrganization: {
    href: "/dashboard/organizations/create",
    label: "Create Team",
    permissions: API_ROUTE.organizations.create.permissions,
    backsTo: "organizations",
    name: "createOrganization",
  },
  editOrganization: {
    href: "/dashboard/organizations/edit",
    label: "Edit Team",
    permissions: API_ROUTE.organizations.update.permissions,
    backsTo: "organizations",
    name: "editOrganization",
  },
  viewOrganization: {
    href: "/dashboard/organizations/view",
    label: "View Team",
    permissions: API_ROUTE.organizations.get.permissions,
    backsTo: "organizations",
    name: "viewOrganization",
  },
  // --------------------------
  // archetypes
  // --------------------------
  archetypes: {
    href: "/dashboard/archetypes",
    label: "Archetypes",
    permissions: API_ROUTE.archetypes.paginate.permissions,
    inMenuFor: API_ROUTE.archetypes.paginate.permissions,
    icon: BookUserIcon,
    name: "archetypes",
  },
  createArchetype: {
    href: "/dashboard/archetypes/create",
    label: "Create Archetype",
    permissions: API_ROUTE.archetypes.create.permissions,
    backsTo: "archetypes",
    name: "createArchetype",
  },
  editArchetype: {
    href: "/dashboard/archetypes/edit",
    label: "Edit Archetype",
    permissions: API_ROUTE.archetypes.update.permissions,
    backsTo: "archetypes",
    name: "editArchetype",
  },
  // --------------------------
  // journals
  // --------------------------
  journals: {
    href: "/dashboard/journals",
    label: "Journals",
    permissions: API_ROUTE.journals.paginate.permissions,
    inMenuFor: ["user"],
    icon: IconJournal,
    name: "journals",
  },
  createJournal: {
    href: "/dashboard/journals/create",
    label: "Create Journal",
    permissions: API_ROUTE.journals.create.permissions,
    backsTo: "journals",
    name: "createJournal",
  },
  editJournal: {
    href: "/dashboard/journals/edit",
    label: "Edit Journal",
    permissions: API_ROUTE.journals.update.permissions,
    backsTo: "journals",
    name: "editJournal",
  },
  // --------------------------
  // ASSESSMENT
  // --------------------------
  assessments: {
    href: "/dashboard/assessments",
    label: "Assessments",
    permissions: API_ROUTE.assessments.paginate.permissions,
    inMenuFor: ["admin"],
    icon: BarChartIcon,
    name: "assessments",
  },
  // --------------------------
  // other
  // --------------------------
  profile: {
    href: "/dashboard/profile",
    label: "Profile",
    permissions: API_ROUTE.users.updateMe.permissions,
    inMenuFor: API_ROUTE.users.updateMe.permissions,
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
} satisfies Record<Route, IRoute>;

export const ROUTES_LIST: IRoute[] = Object.values(ROUTE);
