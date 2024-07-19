import { type IRole } from "../schemas/roles";

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  COACH: "coach",
} as const;

export const ROLES_LIST: IRole[] = Object.values(ROLE) as IRole[];
