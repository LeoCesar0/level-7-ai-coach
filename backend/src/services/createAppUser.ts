import { OrganizationModel } from "../routes/organizations/schemas/organization";
import { ISignUpRoute } from "../routes/users/schemas/signUpRoute";
import { UserModel } from "../routes/users/schemas/user";
import { ENV } from "../static/envs";
import { createFirebaseUser } from "./createFirebaseUser";

export const createAppUser = async ({
  inputs,
  withFirebaseUser,
  firebaseId,
}: {
  inputs: ISignUpRoute;
  withFirebaseUser: boolean;
  firebaseId?: string;
}) => {
  let _firebaseId = firebaseId ?? "TEST_FIREBASE_UID";
  if (withFirebaseUser && !firebaseId) {
    const createdFirebaseUser = await createFirebaseUser({
      inputs: inputs,
    });
    _firebaseId = createdFirebaseUser.uid;
  }
  const isTestEnv = process.env.NODE_ENV === ENV.TEST;

  if (!isTestEnv && !withFirebaseUser && !firebaseId) {
    ("Create App User: Need to pass firebase uid when it's dev env and withFirebaseUser is not enabled");
  }

  const createdUserDoc = await UserModel.create({
    ...inputs.user,
    firebaseId: _firebaseId,
  });

  const createdUser = createdUserDoc.toObject();

  await OrganizationModel.updateOne(
    { _id: createdUser.organization },
    { $addToSet: { users: createdUser._id } }
  );

  return createdUser;
};
