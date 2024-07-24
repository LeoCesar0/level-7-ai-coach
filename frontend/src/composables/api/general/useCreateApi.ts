import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { FetcherMethod } from "~/@types/fetcher";
import type { ToastOptions } from "~/@types/toast";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";
import { type LazyFetcherCommonOptions } from "../../../@types/lazyFetcher";

interface Options<T> extends LazyFetcherCommonOptions {
  bodyRef: MaybeRefOrGetter<T>;
}

export default function useCreateApi<T, R>({
  bodyRef,
  immediate = false,
  url,
  toastOptions = { error: true, loading: true, success: true },
}: Options<T>) {
  const method = "POST";
  const key = slugify(`${url}-${method}`).replace("/", "");
  return useLazyAsyncData<AppResponse<R>, AppResponseError>(
    key,
    () => {
      const body = toValue(bodyRef);
      console.log("❗ here body -->", body);
      return nuxtApiFetcher({
        method: "POST",
        body: body,
        url: parsePath({ url }),
        toastOptions: toastOptions,
      });
    },
    { immediate: immediate }
  );
}
