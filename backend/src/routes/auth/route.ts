import { Hono } from "hono";
import { UserModel, User, zSignUp } from "./schemas/user";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../helpers/routeValidator";
import { EXCEPTIONS } from "../../static/exceptions";
import { OrganizationModel } from "../organizations/schemas/organization";
import { firebaseAuth } from "../../lib/firebase";

const authRoute = new Hono()
  // --------------------------
  // SIGN IN
  // --------------------------
  .post("/", routeValidator({ schema: zSignUp }), async (ctx) => {
    const input = ctx.req.valid("json");
    let resData: AppResponse<User>;

    const firebaseUserExists = await firebaseAuth
      .getUserByEmail(input.user.email)
      .catch((err) => {});

    if (firebaseUserExists) {
      resData = {
        data: null,
        error: {
          _isAppError: true,
          message: EXCEPTIONS.USER_ALREADY_EXISTS,
        },
      };
      return ctx.json(resData, 400);
    }

    const createdFirebaseUser = await firebaseAuth.createUser({
      password: input.password,
      email: input.user.email,
      displayName: input.user.name,
      phoneNumber: input.user.phone,
    });

    const createdUserDoc = await UserModel.create({
      ...input.user,
      firebaseId: createdFirebaseUser.uid,
    });

    const createdUser = createdUserDoc.toObject();

    await OrganizationModel.updateOne(
      { _id: createdUser.organization },
      { $push: { users: createdUser._id } }
    );

    resData = {
      data: createdUser,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default authRoute;
