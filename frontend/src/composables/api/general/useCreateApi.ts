import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { FetcherMethod } from "~/@types/fetcher";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

interface Options<T> {
  bodyRef: MaybeRefOrGetter<T>;
  url: string;
  immediate?: boolean;
}

export default function useCreateApi<T, R>({
  bodyRef,
  immediate = false,
  url,
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
      });
    },
    { immediate: immediate }
  );
}
