import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { handleApiError } from "../handleApiError";
import { handleUnexpectedError } from "../handleUnexpectedError";

export const useFetchApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  try {
    console.log(
      "------------- 🟢 START SESSION useFetchApiFetcher -------------"
    );
    const { data, error } = await useFetch<AppResponse<T>>(url, {
      method: method,
      ...(body ? { body: body } : {}),
      headers: {
        "Content-Type": contentType ?? "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (data.value) {
      return {
        response: data.value,
      };
    }
    if (error.value?.data?.error?._isAppError) {
      const resData: AppResponseError = error.value.data;
      const resError = handleApiError({ error: resData });

      return {
        response: resError,
      };
    }

    throw new Error("❗ useFetchApiFetcher unexpected error");
  } catch (err) {
    console.error("❗ fetchApi server unexpected error -->", err);
    const error = handleUnexpectedError({ error: err });
    return {
      response: error,
    };
  }
};
