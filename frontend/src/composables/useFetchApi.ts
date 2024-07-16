import { normalizeUrl } from "~/helpers/normalizeUrl";
import { useAuthToken } from "./useAuthToken";
import { debugLog } from "~/helpers/debugLog";
import type { AppResponse } from "@common/schemas/app";
import type { UseFetchOptions } from "#app";

export type IFetchApi<T> = {
  url: string;
  loadingRef?: Ref<boolean>;
  options?: UseFetchOptions<AppResponse<T>>;
  token?: string;
};

export const useFetchApi = () => {
  const tokenCookie = useAuthToken();
  const runtime = useRuntimeConfig();
  const baseUrl = runtime.public.apiBase;

  const fetchApi = async <T>({
    loadingRef,
    url,
    options = {},
    token: defaultToken,
  }: IFetchApi<T>) => {
    const fullUrl = normalizeUrl(`${baseUrl}/${url}`);
    const token = defaultToken ?? tokenCookie.value;
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
    return await useFetch<AppResponse<T>>(fullUrl, _options).finally(() => {
      if (loadingRef) {
        loadingRef.value = false;
      }
    });
  };

  return {
    fetchApi,
  };
};
