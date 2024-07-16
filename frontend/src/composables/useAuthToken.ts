import { makeStoreKey } from "~/helpers/makeStoreKey";

export const useAuthToken = () => {
  const tokenCookie = useCookie(makeStoreKey("token"), {
    maxAge: 60 * 60 * 24 * 7,
  });

  return tokenCookie;
};
