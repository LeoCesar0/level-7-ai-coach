import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { IUpdateUserRoute } from "@common/schemas/user/updateUserRoute";
import type { IUserFull } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<IUpdateUserRoute>;
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
