import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IPaginationBody } from "@common/schemas/paginateRoute";
import type { IPaginationResult } from "@common/schemas/pagination";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options<T> extends LazyFetcherCommonOptions {
  bodyRef: MaybeRefOrGetter<IPaginationBody<T>>;
}

export default function usePaginateApi<T>({
  bodyRef,
  url,
  immediate = true,
  toastOptions = { loading: false, error: true, success: false },
  loadingRefs,
  onError,
  onSuccess,
}: Options<T>) {
  const method = "POST";
  const key = slugify(`${url}-${method}`).replace("/", "");
  return useLazyAsyncData<AppResponse<IPaginationResult<T>>, AppResponseError>(
    key,
    () => {
      const _url = parsePath({ url: `${url}/paginate` });
      const body = toValue(bodyRef);
      return nuxtApiFetcher<IPaginationResult<T>>({
        method: method,
        url: _url,
        body: body,
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
