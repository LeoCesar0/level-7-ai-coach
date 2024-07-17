import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type {
  ApiFetcher,
  IApiFetcherOptions,
  IApiFetcherResponse,
} from "~/@types/fetcher";
import { handleApiError } from "../handleApiError";
import { handleUnexpectedError } from "../handleUnexpectedError";

export const serverApiFetcher: ApiFetcher = async <T>({
  method,
  url,
  body,
  contentType,
  token,
}: IApiFetcherOptions): Promise<IApiFetcherResponse<T>> => {
  try {
    console.log(
      "------------- 🟢 START SESSION serverApiFetcher -------------"
    );
    // url = url.replace("localhost", "0.0.0.0");
    console.log("❗ url -->", url);

    const { data, error } = await useFetch<AppResponse<T>>(url, {
      method: method,
      // ...(body ? { body: body } : {}),
      headers: {
        "Content-Type": contentType ?? "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    throw new Error("❗ serverApiFetcher unexpected error");
  } catch (err) {
    console.error("❗ fetchApi server unexpected error -->", err);
    const error = handleUnexpectedError({ error: err });
    return {
      response: error,
    };
  }
};
