import { USER_POPULATES } from "@/static/populates";
import { ModelId } from "../@schemas/mongoose";
import { IUserFull, UserModel } from "../routes/users/schemas/user";

export const getUserFull = async ({ userId }: { userId: ModelId }) => {
  const user = await UserModel.findById<IUserFull>(userId).populate(
    USER_POPULATES
  );
  return user;
};
