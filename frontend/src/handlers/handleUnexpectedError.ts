import type { AppResponseError } from "@common/schemas/app";
import { EXCEPTIONS } from "@common/static/exceptions";
import { FirebaseError } from "firebase/app";

export const handleUnexpectedError = ({
  error,
  defaultMessage,
}: {
  error: any;
  defaultMessage?: string;
}): AppResponseError => {
  let resData: AppResponseError;

  if (error instanceof FirebaseError) {
    error.code === "auth/invalid-credential";
    resData = {
      data: null,
      error: {
        _isAppError: true,
        message: EXCEPTIONS.SIGN_IN_INVALID,
      },
    };
    return resData;
  }

  resData = {
    data: null,
    error: {
      _isAppError: true,
      message: defaultMessage ?? EXCEPTIONS.SERVER_ERROR,
    },
  };

  return resData;
};
