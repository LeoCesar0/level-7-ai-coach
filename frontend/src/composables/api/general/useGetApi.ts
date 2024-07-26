import type { AppResponse, AppResponseError } from "@common/schemas/app";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options extends LazyFetcherCommonOptions {
  paramsRef?: MaybeRefOrGetter<string>;
}

export default function useGetApi<T>({
  url,
  immediate = true,
  paramsRef,
  toastOptions = { loading: false, error: true, success: false },
  loadingRefs,
  onError,
  onSuccess,
}: Options) {
  const method = "GET";
  const id = toValue(paramsRef);
  const key = slugify(`${url}-${method}-${id}`).replace("/", "");
  return useLazyAsyncData<AppResponse<T>, AppResponseError>(
    key,
    () => {
      const _url = id ? `${url}/${id}` : url;
      return nuxtApiFetcher<T>({
        method: method,
        url: parsePath({ url: _url }),
        toastOptions,
        loadingRefs,
        onError,
        onSuccess,
      });
    },
    {
      immediate: immediate,
    }
  );
}
