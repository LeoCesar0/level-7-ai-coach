import { Model } from "mongoose";
import { IUserDoc, UserModel } from "../routes/users/schemas/user";

export const USER_POPULATES: (keyof IUserDoc)[] = ["archetype", "organization"];

export const POPULATES = [
  {
    populates: USER_POPULATES,
    model: UserModel,
  },
];

export const getPopulatesByModel = (model: Model<any>) => {
  const populate = POPULATES.find((item) => item.model === model);
  return populate?.populates;
};
