import sinon from "sinon";
import { IUser } from "../../src/routes/users/schemas/user";

export const stubGetUserFromToken = async (resolves: IUser) => {
  const module = (await import("../../src/services/getUserFromToken"))
    .getUserFromToken;
  const stub = sinon.stub(module, "exec");
  stub.resolves(resolves);
  return stub;
};
