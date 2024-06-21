import { Role } from "../@schemas/roles";

export const ROLES: Record<string, Role> = {
  ADMIN: "admin",
  USER: "user",
  COACH: "coach",
};

export const ROLES_LIST: Role[] = Object.values(ROLES);
