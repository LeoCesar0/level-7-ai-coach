import type { AppResponseError } from "@common/schemas/app";
import { EXCEPTIONS, EXCEPTION_CODE } from "@common/static/exceptions";
import { handleUnexpectedError } from "./handleUnexpectedError";
import { isApiError } from "~/helpers/isApiError";

export const handleApiError = ({ err }: { err: any }): AppResponseError => {
  if (err?.response && err?.response._data) {
    err = err.response._data;
  }
  console.error("❗ handleApi Error -->", err);

  const isAPiError = isApiError(err);
  if (!isAPiError) {
    console.log("❗❗ Unexpected error in handleApiError");
    return handleUnexpectedError({ error: err });
  }

  let resError: AppResponseError = { ...err };
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const { handleSessionExpired } = useUserStore();
  const { toast } = useToast();

  if (err.error.code === EXCEPTION_CODE.EXPIRED_TOKEN) {
    handleSessionExpired();
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
