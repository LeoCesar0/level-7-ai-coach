import type { AppResponse, AppResponseError } from "@common/schemas/app";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

interface Options {
  id: MaybeRefOrGetter<string>;
  url: string;
  immediate?: boolean;
}

export default function useGetApi<T>({ url, immediate = true, id }: Options) {
  const method = "GET";
  const key = slugify(`${url}-${method}-${id}`).replace("/", "");
  return useLazyAsyncData<AppResponse<T>, AppResponseError>(
    key,
    () => {
      return nuxtApiFetcher({
        method: method,
        url: parsePath({ url: `${url}/${id}` }),
      });
    },
    {
      immediate: immediate,
    }
  );
}
