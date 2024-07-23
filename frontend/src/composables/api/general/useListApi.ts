import type { AppResponse, AppResponseError } from "@common/schemas/app";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

interface Options {
  url: string;
  immediate?: boolean;
}

export default function useListApi<T>({ url, immediate = true }: Options) {
  const method = "GET";
  const key = slugify(`${url}-list`).replace("/", "");
  return useLazyAsyncData<AppResponse<T[]>, AppResponseError>(
    key,
    () => {
      return nuxtApiFetcher({
        method: method,
        url: parsePath({ url: `${url}/list` }),
      });
    },
    {
      immediate: immediate,
    }
  );
}
