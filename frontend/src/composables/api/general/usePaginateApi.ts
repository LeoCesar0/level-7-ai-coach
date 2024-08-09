import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IPaginationBody } from "@common/schemas/pagination";
import type { IPaginationResult } from "@common/schemas/pagination";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options<T> extends LazyFetcherCommonOptions {
  bodyRef: MaybeRefOrGetter<IPaginationBody<T>>;
  noLimit?: boolean;
}

export default function usePaginateApi<T>({
  bodyRef,
  url,
  immediate = true,
  toastOptions = { loading: false, error: true, success: false },
  loadingRefs,
  onError,
  onSuccess,
  noLimit,
}: Options<T>) {
  const method = "POST";
  const key = slugify(`${url}-${method}`).replace("/", "");
  return useLazyAsyncData<AppResponse<IPaginationResult<T>>, AppResponseError>(
    key,
    () => {
      const _url = parsePath({ url: url });
      const body = toValue(bodyRef);

      return nuxtApiFetcher<IPaginationResult<T>>({
        method: method,
        url: _url,
        body: {
          ...body,
          limit: noLimit ? 99999 : body.limit,
        },
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
