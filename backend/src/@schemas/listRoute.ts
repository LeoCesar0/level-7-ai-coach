import { z } from "zod";

export const zListRouteQueryInput = z
  .object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(["asc", "ascending", "desc", "descending"]).optional(),
  })
  .transform((val, ctx) => {
    const page = val.page ? Number(val.page) : undefined;
    const limit = val.limit ? Number(val.limit) : undefined;

    const sortBy = val.sortBy ?? "createdAt";
    const sortOrder = val.sortOrder ?? "desc";

    return z
      .object({
        page: z.number().min(1).default(1),
        limit: z.number().min(5).default(10),
        sortBy: z.string().optional(),
        sortOrder: z
          .enum(["asc", "ascending", "desc", "descending"])
          .optional(),
      })
      .parse({
        page,
        limit,
        sortBy,
        sortOrder,
      });
  });

export type IListRouteInput = z.input<typeof zListRouteQueryInput>;
export type IListRouteOutput = z.output<typeof zListRouteQueryInput>;
