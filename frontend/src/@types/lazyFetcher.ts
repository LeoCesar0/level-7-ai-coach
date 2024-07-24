import type { ToastOptions } from "./toast";

export type LazyFetcherCommonOptions = {
  url: string;
  immediate?: boolean;
  toastOptions?: ToastOptions;
  loadingRefs?: Ref<boolean>[];
};
