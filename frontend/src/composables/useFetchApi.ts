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
import { axiosApiFetcher } from "~/handlers/http/axiosApiFetcher";
import type { IApiFetcherOptions } from "~/@types/fetcher";
import { serverApiFetcher } from "~/handlers/http/serverApiFetcher";
import { useFetchApiFetcher } from "~/handlers/http/useFetchApiFetcher";

export type IFetchApiExtraOptions = {
  loadingRef?: Ref<boolean>;
};

export type IFetchApiResponse<T> = { response: AppResponse<T> };

export const useFetchApi = () => {
  const tokenCookie = useAuthToken();
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;

  const fetchApi = async <T>(
    { token: defaultToken, url, ...rest }: IApiFetcherOptions,
    { loadingRef }: IFetchApiExtraOptions = {}
  ): Promise<IFetchApiResponse<T>> => {
    const fullUrl = normalizeUrl(
      `${baseUrl.replace("localhost", "backend")}/${url}`
    );
    const token = defaultToken ?? tokenCookie.value;
    console.log("------------- 🟢 START SESSION FETCH API -------------");
    console.log("❗ fullUrl -->", fullUrl);
    console.log("❗ token in fetch api -->", !!token);

    if (loadingRef) {
      loadingRef.value = true;
    }

    // const fetcher = isServerSide ? serverApiFetcher : axiosApiFetcher;
    const fetcher = useFetchApiFetcher;

    // --------------------------
    // CLIENT FETCHER
    // --------------------------

    const res = await fetcher({
      ...rest,
      url: fullUrl,
      token: token,
    }).finally(() => {
      if (loadingRef) {
        loadingRef.value = false;
      }
    });
    console.log("❗ fetcher api res -->", res);
    console.log("------------- 🔴 END FETCH API -------------");
    return res;
  };

  return {
    fetchApi,
  };
};
