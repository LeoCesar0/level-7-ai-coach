import type { AppResponseError } from "@common/schemas/app";
import { EXCEPTIONS, EXCEPTION_CODE } from "@common/static/exceptions";
import { handleUnexpectedError } from "./handleUnexpectedError";
import { isApiError } from "~/helpers/isApiError";

export const handleApiError = ({ err }: { err: any }): AppResponseError => {
  const isAPiError = isApiError(err);
  if (!isAPiError) {
    console.log("❗❗ Unexpected error in handApiError");
    return handleUnexpectedError({ error: err });
  }

  let resError: AppResponseError = { ...err };
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const { toast } = useToast();

  if (err.error.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
    toast.error("Your session has expired. Please sign in again.");
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
