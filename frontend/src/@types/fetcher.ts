import type { AppResponse, AppResponseError } from "@common/schemas/app";
import type { ToastOptions } from "./toast";

export type FetcherMethod = "POST" | "GET" | "PUT" | "DELETE" | "PATCH";

export type IFetchersCommonOptions<T> = {
  url: string;
  toastOptions?: ToastOptions;
  loadingRefs?: Ref<boolean>[];
  onSuccess?: (data: AppResponse<T>) => Promise<any>;
  onError?: (data: AppResponseError) => Promise<any>;
};

export type IApiFetcherOptions<T = any> = {
  method: FetcherMethod;
  body?: any;
  contentType?: string;
  token?: string | null;
} & IFetchersCommonOptions<T>;

export type IApiFetcherResponse<T> = AppResponse<T>;

export type ApiFetcher = (
  options: IApiFetcherOptions
) => Promise<IApiFetcherResponse<any>>;
