import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ICreateUser } from "@common/schemas/user/createUser";
import type { IUser, IUserFull } from "@common/schemas/user/user";
import { nuxtApiFetcher } from "~/handlers/http/nuxtApiFetcher";

interface Options {
  id: MaybeRefOrGetter<string>;
}

export default function useGetUserApi(opts: Options) {
  return useLazyAsyncData<AppResponse<IUserFull>, AppResponseError>(
    "get-user",
    () => {
      const id = toValue(opts.id);
      return nuxtApiFetcher({
        method: "GET",
        url: "/users/" + id,
      });
    }
  );
}
