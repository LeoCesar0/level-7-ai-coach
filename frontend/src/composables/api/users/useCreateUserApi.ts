import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ICreateUser } from "@common/schemas/user/createUser";
import type { IUser } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<ICreateUser>;
}

export default function useCreateUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUser>, AppResponseError>(
    "create-user",
    () => {
      const user = toValue(opts.values);
      return nuxtApiFetcher({
        method: "POST",
        body: user,
        url: "/users",
      });
    },
    { immediate: false }
  );
}
