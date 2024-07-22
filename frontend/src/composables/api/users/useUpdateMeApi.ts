import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ICreateUser } from "@common/schemas/user/createUser";
import type { IUpdateUserRoute } from "@common/schemas/user/updateUserRoute";
import type { IUser } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  values: MaybeRefOrGetter<IUpdateUserRoute>;
}

export default function useUpdateMeApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUser>, AppResponseError>(
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
