import type { IFetchersCommonOptions } from "./fetcher";

export type LazyFetcherCommonOptions<T = any, R = T> = {
  immediate?: boolean;
} & IFetchersCommonOptions<R>;
