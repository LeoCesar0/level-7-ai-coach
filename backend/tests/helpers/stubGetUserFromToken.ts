import { parseUserToUserDoc } from "@/helpers/parseUserToUserDoc";
import { IUserDoc } from "@/routes/users/schemas/user";
import { IUser } from "@common/schemas/user/user";
import sinon from "sinon";

const isUserNormal = (user: IUserDoc | IUser): user is IUser => {
  return typeof user._id === "string";
};

export const stubGetUserFromToken = async (resolves: IUserDoc | IUser) => {
  const _resolves: IUserDoc = isUserNormal(resolves)
    ? parseUserToUserDoc(resolves)
    : resolves;

  const module = (await import("../../src/services/getUserFromToken"))
    .getUserFromToken;
  const stub = sinon.stub(module, "exec");
  stub.resolves(_resolves);
  return stub;
};
