import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IPaginationBody } from "@common/schemas/paginateRoute";
import type { IUser } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<IPaginationBody<IUser>>;
}

export default function usePaginateUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUser>, AppResponseError>(
    "paginate-user",
    () => {
      const values = toValue(opts.values);
      return nuxtApiFetcher({
        method: "POST",
        url: "/users/paginate",
        body: values,
      });
    }
  );
}
