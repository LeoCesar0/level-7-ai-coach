import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ICreateUser } from "@common/schemas/user/createUser";
import type { IUserFull } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<ICreateUser>;
}

export default function useCreateUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUserFull>, AppResponseError>(
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
