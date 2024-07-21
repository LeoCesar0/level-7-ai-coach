import { USER_POPULATES } from "@/static/populates";
import { IUserFullDoc, UserModel } from "../routes/users/schemas/user";
import { ModelId } from "@common/schemas/mongo";

export const getUserFull = async ({ userId }: { userId: ModelId }) => {
  const user = await UserModel.findById<IUserFullDoc>(userId).populate(
    USER_POPULATES
  );
  return user;
};
