import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { normalizeUrl } from "~/helpers/normalizeUrl";

export const nuxtApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;

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
  const res = await $fetch<AppResponse<T>>(fullUrl, {
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
