import type { AppResponse } from "@common/schemas/app";
import type { ToastOptions } from "./toast";

export type FetcherMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export type IApiFetcherOptions = {
  url: string;
  method: FetcherMethod;
  body?: any;
  contentType?: string;
  token?: string | null;
  toastOptions?: ToastOptions;
};

export type IApiFetcherResponse<T> = AppResponse<T>;

export type ApiFetcher = (
  options: IApiFetcherOptions
) => Promise<IApiFetcherResponse<any>>;
