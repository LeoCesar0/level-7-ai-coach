import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { handleUnexpectedError } from "../handleUnexpectedError";

export const nuxtApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  const isServerSide = typeof window === "undefined";
  if (isServerSide) {
    url = url.replace("localhost", "backend");
  }
  console.log("❗nuxt fetcher url -->", url);
  console.log("❗ !!token -->", !!token);
  const res = await $fetch<AppResponse<T>>(url, {
    method: method,
    ...(body ? { body: body } : {}),
    headers: {
      "Content-Type": contentType ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  return {
    response: res,
  };
};
