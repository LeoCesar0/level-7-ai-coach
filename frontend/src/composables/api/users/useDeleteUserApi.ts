import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ICreateUser } from "@common/schemas/user/createUser";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  userId: MaybeRefOrGetter<ICreateUser>;
}

export default function useDeleteUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<boolean>, AppResponseError>(
    "delete-user",
    () => {
      const userId = toValue(opts.userId);
      return nuxtApiFetcher({
        method: "DELETE",
        url: "/users/" + userId,
      });
    },
    { immediate: false }
  );
}
