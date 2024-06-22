import { Role } from "../@schemas/roles";

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  COACH: "coach",
};

export const ROLES_LIST: Role[] = Object.values(ROLE) as Role[];
