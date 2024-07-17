import type { AppResponse, AppResponseError } from "@common/schemas/app";
import axios, { AxiosError } from "axios";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { handleApiError } from "../handleApiError";
import { handleUnexpectedError } from "../handleUnexpectedError";

export const axiosApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  try {
    const { data } = await axios<AppResponse<T>>({
      method: method,
      url: url,
      ...(body ? { data: body } : {}),
      headers: {
        "Content-Type": contentType ?? "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    console.log("❗ data axios -->", data);
    return {
      response: data,
    };
  } catch (err) {
    if (err instanceof AxiosError && err.response?.data) {
      const resData: AppResponseError = err.response.data;
      const resError = handleApiError({ error: resData });
      console.error("❗ fetchApi axis error -->", err.response, resError);

      return {
        response: resError,
      };
    }
    console.error("❗ fetchApi axios unexpected error -->", err);
    const error = handleUnexpectedError({ error: err });
    return {
      response: error,
    };
  }
};
