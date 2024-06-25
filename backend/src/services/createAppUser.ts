import { OrganizationModel } from "../routes/organizations/schemas/organization";
import { ISignUpRoute } from "../routes/users/schemas/signUpRoute";
import { UserModel } from "../routes/users/schemas/user";
import { ENV } from "../static/envs";
import { createFirebaseUser } from "./createFirebaseUser";

export const createAppUser = async ({
  inputs,
  withFirebaseUser,
}: {
  inputs: ISignUpRoute;
  withFirebaseUser: boolean;
}) => {
  let uid = "TEST_FIREBASE_UID";
  if (withFirebaseUser) {
    const createdFirebaseUser = await createFirebaseUser({
      inputs: inputs,
    });
    uid = createdFirebaseUser.uid;
  }

  if (!withFirebaseUser && process.env.NODE_ENV !== ENV.TEST) {
    throw new Error("Firebase user is required");
  }

  const createdUserDoc = await UserModel.create({
    ...inputs.user,
    firebaseId: uid,
  });

  const createdUser = createdUserDoc.toObject();

  await OrganizationModel.updateOne(
    { _id: createdUser.organization },
    { $push: { users: createdUser._id } }
  );

  return createdUser;
};
