import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IPaginationBody } from "@common/schemas/paginateRoute";
import type { IPaginationResult } from "@common/schemas/pagination";
import type { ToastOptions } from "~/@types/toast";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";
import { parsePath } from "~/helpers/parsePath";
import { slugify } from "~/helpers/slugify";

interface Options<T> {
  bodyRef: MaybeRefOrGetter<IPaginationBody<T>>;
  url: string;
  immediate?: boolean;
  toastOptions?: ToastOptions;
}

export default function usePaginateApi<T>({
  bodyRef,
  url,
  immediate = true,
  toastOptions = { loading: false, error: true, success: false },
}: Options<T>) {
  const method = "POST";
  const key = slugify(`${url}-${method}`).replace("/", "");
  return useLazyAsyncData<AppResponse<IPaginationResult<T>>, AppResponseError>(
    key,
    () => {
      const _url = parsePath({ url: `${url}/paginate` });
      const body = toValue(bodyRef);
      return nuxtApiFetcher({
        method: method,
        url: _url,
        body: body,
        toastOptions,
      });
    },
    {
      immediate: immediate,
    }
  );
}
