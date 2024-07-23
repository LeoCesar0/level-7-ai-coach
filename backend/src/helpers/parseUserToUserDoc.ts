import { IUserDoc } from "@/routes/users/schemas/user";
import { stringToDate } from "@common/helpers/stringToDate";
import { IUser } from "@common/schemas/user/user";
import { ObjectId } from "mongodb";

export const parseUserToUserDoc = (user: IUser): IUserDoc => {
  return {
    ...user,
    _id: new ObjectId(user._id),
    createdAt: stringToDate(user.createdAt),
    updatedAt: stringToDate(user.updatedAt),
    organization: new ObjectId(user.organization),
    archetype: user.archetype ? new ObjectId(user.archetype) : undefined,
    birthDate: user.birthDate ? stringToDate(user.birthDate) : undefined,
  };
};
