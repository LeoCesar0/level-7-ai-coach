import { type FilterQuery } from "mongoose";
import z from "zod";

export const zFilters = z.record(z.string(), z.any());

export const zPaginateRouteQueryInput = z
  .object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
    sortBy: z.string().nullish(),
    sortOrder: z.enum(["asc", "ascending", "desc", "descending"]).nullish(),
    filters: zFilters.nullish(),
  })
  .default({
    limit: 10,
    page: 1,
  });

export type IPaginationBody<T = any> = {
  page?: number | undefined;
  limit?: number | undefined;
  sortBy?: string | null | undefined;
  sortOrder?: "asc" | "ascending" | "desc" | "descending" | null | undefined;
  filters?: FilterQuery<T> | null | undefined;
};

export type IPaginationBodyOutput<T = any> = {
  page: number;
  limit: number;
  sortBy?: string | null | undefined;
  sortOrder?: "asc" | "ascending" | "desc" | "descending" | null | undefined;
  // filters?: Record<string, any> | null | undefined;
  filters?: FilterQuery<T> | null | undefined;
};
