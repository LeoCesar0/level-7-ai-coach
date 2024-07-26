import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ToastOptions } from "~/@types/toast";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options extends LazyFetcherCommonOptions {}

export default function useListApi<T>({
  url,
  immediate = true,
  toastOptions = { loading: false, error: true, success: false },
  loadingRefs,
  onError,
  onSuccess,
}: Options) {
  const method = "GET";
  const key = slugify(`${url}-list`).replace("/", "");
  return useLazyAsyncData<AppResponse<T[]>, AppResponseError>(
    key,
    () => {
      return nuxtApiFetcher<T[]>({
        method: method,
        url: parsePath({ url: url }),
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
