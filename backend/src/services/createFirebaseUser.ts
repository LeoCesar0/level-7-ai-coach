import { firebaseAuth } from "../lib/firebase";
import { ISignUpRoute } from "../routes/users/schemas/signUpRoute";
import { ENV } from "../static/envs";

export const createFirebaseUser = async ({
  inputs,
}: {
  inputs: ISignUpRoute;
}) => {
  const createdFirebaseUser = await firebaseAuth.createUser({
    password: inputs.password,
    email: inputs.user.email,
    displayName: inputs.user.name,
    phoneNumber: inputs.user.phone,
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
