import type { AppResponseError } from "@common/schemas/app";
import { EXCEPTIONS, EXCEPTION_CODE } from "@common/static/exceptions";
import { FirebaseError } from "firebase/app";

export const handleUnexpectedError = ({
  error,
  errorMessage,
}: {
  error: any;
  errorMessage?: string;
}): AppResponseError => {
  let resData: AppResponseError;

  if (error instanceof FirebaseError) {
    error.code === EXCEPTION_CODE.INVALID_CREDENTIALS;
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
      message: errorMessage ?? EXCEPTIONS.REQUEST_ERROR,
    },
  };

  return resData;
};
