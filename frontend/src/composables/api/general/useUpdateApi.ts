import type { AppResponse, AppResponseError } from "@common/schemas/app";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options<T> extends LazyFetcherCommonOptions {
  bodyRef: MaybeRefOrGetter<T>;
  id: string;
}

export default function useUpdateApi<T>({
  bodyRef,
  id,
  url,
  immediate = false,
  toastOptions = { error: true, loading: true, success: true },
}: Options<T>) {
  const method = "PUT";
  const key = slugify(`${url}-${method}-${id}`).replace("/", "");
  return useLazyAsyncData<AppResponse<T>, AppResponseError>(
    key,
    () => {
      const body = toValue(bodyRef);
      return nuxtApiFetcher({
        method: method,
        body: body,
        url: parsePath({ url }),
        toastOptions,
      });
    },
    { immediate: immediate }
  );
}
