import { FirebaseAuthError } from "firebase-admin/auth";
import { firebaseAuth } from "../lib/firebase";
import { IUserDoc, UserModel } from "../routes/users/schemas/user";
import { Context } from "hono";
import { EXCEPTION_CODE } from "@common/static/exceptions";

export type IGetUserFromToken = {
  token: string;
  ctx?: Context;
};

const exec = async ({
  token,
  ctx,
}: IGetUserFromToken): Promise<IUserDoc | null> => {
  try {
    const res = await firebaseAuth.verifyIdToken(token);

    const user = await UserModel.findOne({
      firebaseId: res.uid,
    });
    if (!user) return null;
    return user.toObject();
  } catch (err) {
    if (err instanceof FirebaseAuthError) {
      console.log("❗ err.code -->", err.code);
      if (err.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
        if (ctx) {
          ctx.set("expiredToken", true);
          return null;
        }
      }
    }
    return null;
  }
};
// export default getUserFromToken;

export const getUserFromToken = {
  exec: exec,
};
