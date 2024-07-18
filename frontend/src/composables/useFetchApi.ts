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
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;

  const fetchApi = async <T>(
    { url, ...rest }: IApiFetcherOptions,
    { loadingRef }: IFetchApiExtraOptions = {}
  ): Promise<IFetchApiResponse<T>> => {
    const fullUrl = normalizeUrl(`${baseUrl}/${url}`);
    const token = authToken.value;
    console.log("❗AHOY token -->", token);

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
