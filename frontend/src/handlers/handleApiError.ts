import type { AppResponseError } from "@common/schemas/app";
import { EXCEPTIONS, EXCEPTION_CODE } from "@common/static/exceptions";

export const handleApiError = ({
  error,
  errorMessage,
}: {
  error: AppResponseError;
  errorMessage?: string;
}): AppResponseError => {
  let resError: AppResponseError = { ...error };
  const authCookie = useAuthToken();

  if (error.error.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
    console.log("❗❗❗ Here Removing Token");
    authCookie.value = "";
    resError = {
      data: null,
      error: {
        _isAppError: true,
        message: EXCEPTIONS.SIGN_IN_INVALID,
      },
    };
    return resError;
  }

  return resError;
};
