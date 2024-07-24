import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { FetcherMethod } from "~/@types/fetcher";
import type { ToastOptions } from "~/@types/toast";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";
import { slugify } from "~/helpers/slugify";

interface Options extends LazyFetcherCommonOptions {
  paramsRef: MaybeRefOrGetter<string>;
}

export default function useDeleteApi<R = boolean>({
  paramsRef,
  url,
  immediate = false,
  toastOptions = { error: true, loading: true, success: true },
}: Options) {
  const method = "DELETE";
  const key = slugify(`${url}-${method}`).replace("/", "");
  return useLazyAsyncData<AppResponse<R>, AppResponseError>(
    key,
    () => {
      const id = toValue(paramsRef);
      return nuxtApiFetcher({
        method: method,
        url: parsePath({ url: `${url}/${id}` }),
        toastOptions,
      });
    },
    { immediate: immediate }
  );
}
