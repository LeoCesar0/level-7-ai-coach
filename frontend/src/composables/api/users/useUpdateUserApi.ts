import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import type { IUserFull } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<IUpdateUser>;
}

export default function useUpdateUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUserFull>, AppResponseError>(
    "update-user",
    () => {
      const user = toValue(opts.values);
      return nuxtApiFetcher({
        method: "PUT",
        body: user,
        url: "/users/" + user._id,
      });
    },
    { immediate: false }
  );
}
