import { ENV } from "@common/static/envs";
import { firebaseAuth } from "../lib/firebase";
import { ICreateUserRoute } from "@common/schemas/user/createUserRoute";

export const createFirebaseUser = async ({
  inputs,
}: {
  inputs: ICreateUserRoute;
}) => {
  const createdFirebaseUser = await firebaseAuth.createUser({
    password: inputs.password,
    email: inputs.user.email,
    displayName: inputs.user.name,
  });
  if (process.env.NODE_ENV === ENV.TEST) {
    globalThis.TEST_GLOBALS.createdUsers.push({
      email: inputs.user.email,
      name: inputs.user.name,
      firebaseId: createdFirebaseUser.uid,
    });
  }
  return createdFirebaseUser;
};
