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
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const { toast } = useToast();

  if (error.error.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
    toast.error("Your session has expired. Please sign in again.");
    // console.log("❗ REMOVING TOKEN WHICH EXPIRED -->");
    // authToken.value = "";
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
