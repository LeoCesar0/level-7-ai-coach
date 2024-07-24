import { IUserDoc } from "@/routes/users/schemas/user";
import { parseToDate } from "@common/helpers/parseToDate";
import { IUser } from "@common/schemas/user/user";
import { ObjectId } from "mongodb";

export const parseUserToUserDoc = (user: IUser): IUserDoc => {
  return {
    ...user,
    _id: new ObjectId(user._id),
    createdAt: parseToDate(user.createdAt),
    updatedAt: parseToDate(user.updatedAt),
    organization: new ObjectId(user.organization),
    archetype: user.archetype ? new ObjectId(user.archetype) : undefined,
    birthDate: user.birthDate ? parseToDate(user.birthDate) : undefined,
  };
};
