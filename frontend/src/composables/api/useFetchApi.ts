import type { AppResponse } from "@common/schemas/app";
import type { IApiFetcherOptions } from "~/@types/fetcher";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { handleApiError } from "~/handlers/handleApiError";

export type IFetchApiExtraOptions = {
  loadingRefs?: Ref<boolean>[];
  showError?: boolean;
};

export type IFetchApiResponse<T> = AppResponse<T>;

export const useFetchApi = () => {
  const fetchApi = async <T>({
    url,
    ...rest
  }: IApiFetcherOptions<T>): Promise<IFetchApiResponse<T>> => {
    const fetcher = nuxtApiFetcher;

    try {
      const res = await fetcher({
        ...rest,
        url: url,
      });
      return res;
    } catch (err) {
      const res = handleApiError({ err: err });
      return res;
    }
  };
  return {
    fetchApi,
  };
};
