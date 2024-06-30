import { IChatRole, IRole } from "../@schemas/roles";

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  COACH: "coach",
} as const;

export const CHAT_ROLE = {
  USER: "user",
  SYSTEM: "system",
  ASSISTANT: "assistant",
} as const;

export const ROLES_LIST: IRole[] = Object.values(ROLE) as IRole[];

export const CHAT_ROLES_LIST: IChatRole[] = Object.values(
  CHAT_ROLE
) as IChatRole[];
