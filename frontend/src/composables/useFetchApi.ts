import { normalizeUrl } from "~/helpers/normalizeUrl";
import { useAuthToken } from "./useAuthToken";
import { debugLog } from "~/helpers/debugLog";
import type { AppResponse } from "@common/schemas/app";
import type { IApiFetcherOptions } from "~/@types/fetcher";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { isApiError } from "~/helpers/isApiError";
import { handleApiError } from "~/handlers/handleApiError";

export type IFetchApiExtraOptions = {
  loadingRefs?: Ref<boolean>[];
  showError?: boolean;
};

export type IFetchApiResponse<T> = AppResponse<T>;

export const useFetchApi = () => {
  const authStore = useAuthToken();
  const { authToken } = storeToRefs(authStore);
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;
  const { toast } = useToast();

  const fetchApi = async <T>(
    { url, ...rest }: IApiFetcherOptions,
    { loadingRefs = [], showError = true }: IFetchApiExtraOptions = {}
  ): Promise<IFetchApiResponse<T>> => {
    const fullUrl = normalizeUrl(`${baseUrl}/${url}`);
    const token = authToken.value;

    loadingRefs.forEach((loadingRef) => {
      loadingRef.value = true;
    });

    // const fetcher = isServerSide ? serverApiFetcher : axiosApiFetcher;
    const fetcher = nuxtApiFetcher;

    // --------------------------
    // CLIENT FETCHER
    // --------------------------

    try {
      const res = await fetcher({
        ...rest,
        url: fullUrl,
        token: token,
      });
      console.log("❗ fetcher res -->", res);
      return res;
    } catch (err) {
      const res = handleApiError({ err: err });
      console.error("❗ fetchApi treated Error -->", res);
      if (showError) {
        toast.error(res.error.message);
      }
      return res;
    } finally {
      loadingRefs.forEach((loadingRef) => {
        loadingRef.value = false;
      });
    }
  };

  return {
    fetchApi,
  };
};
