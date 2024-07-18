import type { IChatRole } from "./roles";

export type IChatHistoryMessage = {
  chat: string;
  message: string;
  role: IChatRole;
};
