import { AppResponse } from "@common/schemas/app";
import { EXCEPTIONS } from "@common/static/exceptions";
import { FirebaseError } from "firebase/app";
import { ErrorHandler } from "hono";
import { BlankEnv } from "hono/types";

export const handleAppError: ErrorHandler<BlankEnv> = (error, ctx) => {
  let resData: AppResponse<null>;

  if (error instanceof FirebaseError) {
    error.code === "auth/invalid-credential";
    resData = {
      data: null,
      error: {
        _isAppError: true,
        message: EXCEPTIONS.SIGN_IN_INVALID,
      },
    };
    return ctx.json(resData, 400);
  }

  resData = {
    data: null,
    error: {
      _isAppError: true,
      message: EXCEPTIONS.SERVER_ERROR,
    },
  };

  return ctx.json(resData, 500);
};
