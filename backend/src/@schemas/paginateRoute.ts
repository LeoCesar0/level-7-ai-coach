import { z } from "zod";

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

export type IPaginationBody = z.input<typeof zPaginateRouteQueryInput>;
export type IPaginationBodyOutput = z.output<typeof zPaginateRouteQueryInput>;
