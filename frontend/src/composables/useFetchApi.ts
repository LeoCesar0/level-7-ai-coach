import { normalizeUrl } from "~/helpers/normalizeUrl";
import { useAuthToken } from "./useAuthToken";
import { debugLog } from "~/helpers/debugLog";
import type { AppResponse } from "@common/schemas/app";
import type { IApiFetcherOptions } from "~/@types/fetcher";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

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

    if (loadingRef) {
      loadingRef.value = true;
    }

    // const fetcher = isServerSide ? serverApiFetcher : axiosApiFetcher;
    const fetcher = nuxtApiFetcher;

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
    return res;
  };

  return {
    fetchApi,
  };
};
