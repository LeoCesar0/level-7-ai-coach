import { ChatRole, Role } from "../@schemas/roles";

export const ROLE = {
  ADMIN: "admin",
  USER: "user",
  COACH: "coach",
} as const

export const CHAT_ROLE = {
  USER: "user",
  SYSTEM: "system",
  ASSISTANT: "assistant",
} as const;

export const ROLES_LIST: Role[] = Object.values(ROLE) as Role[];

export const CHAT_ROLES_LIST: ChatRole[] = Object.values(
  CHAT_ROLE
) as ChatRole[];
