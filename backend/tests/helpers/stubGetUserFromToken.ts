import { IUserDoc } from "@/routes/users/schemas/user";
import { IUser } from "@common/schemas/user";
import sinon from "sinon";

export const stubGetUserFromToken = async (resolves: IUser | IUserDoc) => {
  const module = (await import("../../src/services/getUserFromToken"))
    .getUserFromToken;
  const stub = sinon.stub(module, "exec");
  stub.resolves(resolves);
  return stub;
};
