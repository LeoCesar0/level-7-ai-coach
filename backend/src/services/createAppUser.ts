import { ENV } from "@common/static/envs";
import { OrganizationModel } from "../routes/organizations/schemas/organization";
import { UserModel } from "../routes/users/schemas/user";
import { createFirebaseUser } from "./createFirebaseUser";
import { ICreateUser } from "@common/schemas/user/createUser";

export const createAppUser = async ({
  inputs,
  firebaseId,
}: {
  inputs: {
    password: string;
    user: ICreateUser & { _id?: string };
  };
  firebaseId?: string;
}) => {
  let _firebaseId = firebaseId ?? "TEST_FIREBASE_UID";

  const isTestEnv = process.env.NODE_ENV === ENV.TEST;

  if (!isTestEnv && !firebaseId) {
    const createdFirebaseUser = await createFirebaseUser({
      inputs: inputs,
    });
    _firebaseId = createdFirebaseUser.uid;
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
