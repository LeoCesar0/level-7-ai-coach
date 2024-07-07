import { z } from "zod";

export const zFilters = z.record(z.string(), z.any()).nullish();

export const zListRouteQueryInput = z
  .object({
    page: z.number().min(1).default(1),
    limit: z.number().min(1).default(10),
    sortBy: z.string().nullish(),
    sortOrder: z.enum(["asc", "ascending", "desc", "descending"]).nullish(),
    filters: zFilters,
  })
  .default({
    limit: 10,
    page: 1,
  });

export type IPaginationBody = z.input<typeof zListRouteQueryInput>;
export type IPaginationBodyOutput = z.output<typeof zListRouteQueryInput>;

// export const zListRouteQueryInput = z
//   .object({
//     page: z.string().optional(),
//     limit: z.string().optional(),
//     sortBy: z.string().optional(),
//     sortOrder: z.enum(["asc", "ascending", "desc", "descending"]).optional(),
//     filters: zFilters,
//   })
//   .transform((val, ctx) => {
//     const page = val.page ? Number(val.page) : undefined;
//     const limit = val.limit ? Number(val.limit) : undefined;

//     const sortBy = val.sortBy ?? "createdAt";
//     const sortOrder = val.sortOrder ?? "desc";

//     return z
//       .object({
//         page: z.number().min(1).default(1),
//         limit: z.number().min(1).default(10),
//         sortBy: z.string().optional(),
//         sortOrder: z
//           .enum(["asc", "ascending", "desc", "descending"])
//           .optional(),
//         filters: zFilters,
//       })
//       .parse({
//         page,
//         limit,
//         sortBy,
//         sortOrder,
//         filters: val.filters,
//       });
//   });
