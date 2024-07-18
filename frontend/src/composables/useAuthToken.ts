import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useAuthToken = defineStore(
  makeStoreKey("auth-token-store"),
  () => {
    const authToken = useCookie(makeStoreKey("token"), {
      maxAge: 60 * 60 * 24 * 7,
    });

    return {
      authToken,
    };
  }
);
