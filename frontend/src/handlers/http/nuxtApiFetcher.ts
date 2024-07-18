import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { handleUnexpectedError } from "../handleUnexpectedError";

export const nuxtApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  console.log("------------- 🟢 START SESSION nuxtApiFetcher -------------");
  try {
    const isServerSide = typeof window === "undefined";
    if (isServerSide) {
      url = url.replace("localhost", "backend");
    }
    console.log("❗ isServerSide -->", isServerSide);
    console.log("❗ url -->", url);
    console.log("❗ token -->", token);
    const res = await $fetch<AppResponse<T>>(url, {
      method: method,
      ...(body ? { body: body } : {}),
      headers: {
        "Content-Type": contentType ?? "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    return {
      response: res,
    };
  } catch (err) {
    console.error("❗ nuxtApi server unexpected error -->", err);
    const error = handleUnexpectedError({ error: err });
    console.error("❗ nuxtApi server treated error -->", error);
    return {
      response: error,
    };
  } finally {
    console.log("------------- 🔴 END nuxtApiFetcher -------------");
  }
};
