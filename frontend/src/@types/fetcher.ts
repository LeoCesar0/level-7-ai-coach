import type { AppResponse } from "@common/schemas/app";

interface IFetcherOptions {
  url: string;
  method: "POST" | "GET" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  contentType?: string;
  token?: string;
  onSuccessData?: any;
}

export type Fetcher = (options: IFetcherOptions) => Promise<AppResponse<any>>;
