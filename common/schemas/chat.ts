import type { IMessageType } from "./chatHistory";

export type IChat = {
  user: string;
  date: string | Date;
  _id: string;
  createdAt: string;
  updatedAt: string;
  closed?: boolean | undefined;
  assessed?: boolean | undefined;
};

export type ICreateChat = {
  user: string;
  date: string;
};

export type ICreateMessage = {
  user: string;
  message: string;
  role: IMessageType;
  chat: string;
};
