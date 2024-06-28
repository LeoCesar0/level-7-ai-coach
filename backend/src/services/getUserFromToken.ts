import { firebaseAuth } from "../lib/firebase";
import { UserModel } from "../routes/users/schemas/user";

export type IGetUserFromToken = {
  token: string;
};

const exec = async ({ token }: IGetUserFromToken) => {
  // if(process.env.NODE_ENV === ENV.TEST){
  //   const user = await
  // }

  try {
    const res = await firebaseAuth.verifyIdToken(token);

    const user = await UserModel.findOne({
      firebaseId: res.uid,
    });
    if (!user) return null;
    return user.toObject();
  } catch (err) {
    return null;
  }
};
// export default getUserFromToken;

export const getUserFromToken = {
  exec: exec,
};
