import type { AppResponse, AppResponseError } from "@common/schemas/app";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options extends LazyFetcherCommonOptions {
  id: MaybeRefOrGetter<string>;
}

export default function useGetApi<T>({
  url,
  immediate = true,
  id,
  toastOptions = { loading: false, error: true, success: false },
}: Options) {
  const method = "GET";
  const key = slugify(`${url}-${method}-${id}`).replace("/", "");
  return useLazyAsyncData<AppResponse<T>, AppResponseError>(
    key,
    () => {
      return nuxtApiFetcher({
        method: method,
        url: parsePath({ url: `${url}/${id}` }),
        toastOptions,
      });
    },
    {
      immediate: immediate,
    }
  );
}
