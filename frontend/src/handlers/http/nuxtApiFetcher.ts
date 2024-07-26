import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { normalizeUrl } from "~/helpers/normalizeUrl";
import { handleApiError } from "../handleApiError";
import type { Id as LoadingId } from "vue3-toastify";

export const nuxtApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
  toastOptions = {},
  loadingRefs = [],
  onError,
  onSuccess,
}: IApiFetcherOptions<T>): Promise<IApiFetcherResponse<T>> => {
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;
  const { toast } = useToast();

  loadingRefs.forEach((loadingRef) => {
    loadingRef.value = true;
  });

  let toastLoadingId: null | LoadingId = null;

  if (toastOptions.loading) {
    const loadingMes =
      typeof toastOptions.loading === "boolean"
        ? "Loading..."
        : toastOptions.loading.message;
    toastLoadingId = toast.loading(loadingMes);
  }

  const fullUrl = normalizeUrl(`${baseUrl}/${url}`);

  if (!token) {
    token = authToken.value;
  }

  const isServerSide = typeof window === "undefined";
  if (isServerSide) {
    url = url.replace("localhost", "backend");
  }
  console.log("❗nuxt fetcher fullUrl -->", fullUrl);
  console.log("❗ !!token -->", !!token);
  console.log("❗ body -->", body);
  console.log("❗ method -->", method);

  const handleError = async (err: AppResponseError) => {
    if (onError) {
      await onError(err);
      await nextTick()
    }
    const errMessage =
      typeof toastOptions.error === "object"
        ? toastOptions.error.message
        : err.error.message;
    if (toastLoadingId) {
      toast.update(toastLoadingId, {
        render: errMessage,
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
    if (!toastLoadingId && toastOptions.error) {
      toast.error(errMessage);
    }
  };

  const res = await $fetch<AppResponse<T>>(fullUrl, {
    method: method,
    ...(body ? { body: body } : {}),
    headers: {
      "Content-Type": contentType ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    onRequestError({ request, error, options, response }) {
      console.log("❗ onRequestError error -->", error);
      console.log("❗ onRequestError response -->", response);
      const resError = handleApiError({ err: response });
      handleError(resError);
    },
    onResponseError({ response, options }) {
      console.log("❗ onResponseError -->", response);
      const resError = handleApiError({ err: response._data });
      handleError(resError);
    },
  }).finally(() => {
    loadingRefs.forEach((loadingRef) => {
      loadingRef.value = false;
    });
  });

  console.log("❗ nuxtApiFetcher res -->", res);

  // --------------------------
  // HANDLE SUCCESS
  // --------------------------
  if (!res.error) {
    if (onSuccess) {
      await onSuccess(res);
      await nextTick();
    }
    const successMessage =
      typeof toastOptions.success === "object"
        ? toastOptions.success.message
        : "Success";

    if (toastLoadingId) {
      toast.update(toastLoadingId, {
        render: successMessage,
        type: "success",
        isLoading: false,
        autoClose: 5000,
      });
    }
    if (!toastLoadingId && toastOptions.success) {
      toast.success(successMessage);
    }
  }

  return res;
};
