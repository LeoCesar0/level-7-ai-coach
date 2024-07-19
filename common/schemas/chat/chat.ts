import { z } from "zod";
import { zId } from "@zodyac/zod-mongoose";
import { zIsoDate } from "../primitives/isoDate";

export type IChat = {
  user: string;
  date: string | Date;
  _id: string;
  createdAt: string;
  updatedAt: string;
  closed?: boolean | undefined;
  assessed?: boolean | undefined;
};
