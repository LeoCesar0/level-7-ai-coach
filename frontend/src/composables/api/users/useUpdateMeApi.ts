import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import type { IUserFull } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<IUpdateUser>;
}

export default function useUpdateMeApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUserFull>, AppResponseError>(
    "update-me",
    () => {
      const user = toValue(opts.values);
      return nuxtApiFetcher({
        method: "PUT",
        body: user,
        url: "/users/me",
      });
    },
    { immediate: false }
  );
}
