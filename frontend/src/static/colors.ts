import { type IRole } from "@common/schemas/roles";

export const ROLE_COLORS_TW: Record<IRole, string> = {
  admin: "red-500",
  user: "blue-500",
  coach: "green-500",
};

export const ROLE_COLORS: Record<IRole, string> = {
  admin: "#ef4444",
  user: "#3b82f6",
  coach: "#22c55e",
};
