import { IUserDoc } from "@/routes/users/schemas/user";
import { IUser } from "@common/schemas/user/user";

export const parseUserDoc = (user: IUserDoc): IUser => {
  return {
    ...user,
    _id: user._id.toString(),
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    organization: user.organization.toString(),
    archetype: user.archetype?.toString() ?? undefined,
    birthDate: user.birthDate,
  };
};
