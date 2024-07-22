import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";

export const nuxtApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);

  if (!token) {
    token = authToken.value;
  }

  const isServerSide = typeof window === "undefined";
  if (isServerSide) {
    url = url.replace("localhost", "backend");
  }
  console.log("❗nuxt fetcher url -->", url);
  console.log("❗ !!token -->", !!token);
  console.log("❗ body -->", body);
  console.log("❗ method -->", method);
  const res = await $fetch<AppResponse<T>>(url, {
    method: method,
    ...(body ? { body: body } : {}),
    headers: {
      "Content-Type": contentType ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    onResponse({ request, response, options }) {},
    onRequestError({ request, error, options, response }) {
      console.log("❗ onRequestError -->", error);
    },
    onResponseError({ response, error, options }) {
      console.log("❗ onResponseError -->", error);
    },
  });

  return res;
};
