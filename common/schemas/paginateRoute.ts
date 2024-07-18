import { type FilterQuery } from "mongoose";

export type IPaginationBody<T = any> =
  | {
      page?: number | undefined;
      limit?: number | undefined;
      sortBy?: string | null | undefined;
      sortOrder?:
        | "asc"
        | "ascending"
        | "desc"
        | "descending"
        | null
        | undefined;
      filters?: FilterQuery<T> | null | undefined;
    }
  | undefined;

export type IPaginationBodyOutput<T = any> = {
  page: number;
  limit: number;
  sortBy?: string | null | undefined;
  sortOrder?: "asc" | "ascending" | "desc" | "descending" | null | undefined;
  // filters?: Record<string, any> | null | undefined;
  filters?: FilterQuery<T> | null | undefined;
};
