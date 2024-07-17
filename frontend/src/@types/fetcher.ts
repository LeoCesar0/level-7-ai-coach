import type { AppResponse } from "@common/schemas/app";

export type IApiFetcherOptions = {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  contentType?: string;
  token?: string | null;
};

export type IApiFetcherResponse<T> = {
  response: AppResponse<T>;
};

export type ApiFetcher = (
  options: IApiFetcherOptions
) => Promise<IApiFetcherResponse<any>>;
