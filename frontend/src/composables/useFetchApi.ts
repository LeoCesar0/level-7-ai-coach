import { normalizeUrl } from "~/helpers/normalizeUrl";
import { useAuthToken } from "./useAuthToken";
import { debugLog } from "~/helpers/debugLog";
import type {
  AppError,
  AppResponse,
  AppResponseError,
} from "@common/schemas/app";
import type { UseFetchOptions } from "#app";
import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { handleUnexpectedError } from "~/handlers/handleUnexpectedError";
import { handleApiError } from "~/handlers/handleApiError";

export type IFetchApi<T> = {
  url: string;
  loadingRef?: Ref<boolean>;
  options?: AxiosRequestConfig;
  token?: string;
};

export type IFetchApiResponse<T> = { response: AppResponse<T> };

export const useFetchApi = () => {
  const tokenCookie = useAuthToken();
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;

  const fetchApi = async <T>({
    loadingRef,
    url,
    options = {},
    token: defaultToken,
  }: IFetchApi<T>): Promise<IFetchApiResponse<T>> => {
    const fullUrl = normalizeUrl(`${baseUrl}/${url}`);
    const token = defaultToken ?? tokenCookie.value;
    console.log("❗ token in fetchapi -->", !!token);
    const _options: typeof options = {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers ?? {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    if (loadingRef) {
      loadingRef.value = true;
    }

    try {
      const { data } = await axios<AppResponse<T>>({
        method: options.method ?? "GET",
        url: fullUrl,
        ..._options,
      });

      console.log("❗ data -->", data);
      return {
        response: data,
      };
    } catch (err) {
      if (err instanceof AxiosError && err.response?.data) {
        const resData: AppResponseError = err.response.data;
        const resError = handleApiError({ error: resData });
        console.error("❗ fetchApi error -->", err.response, resError);

        return {
          response: resError,
        };
      }
      console.error("❗ fetchApi unexpected error -->", err);
      const error = handleUnexpectedError({ error: err });
      return {
        response: error,
      };
    }

    // const { data, error } = await useFetch<AppResponse<T>, AppResponseError>(
    //   fullUrl,
    //   _options
    // ).finally(() => {
    //   if (loadingRef) {
    //     loadingRef.value = false;
    //   }
    // });
  };

  return {
    fetchApi,
  };
};
