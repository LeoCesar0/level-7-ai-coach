export type IPaginationBody =
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
      filters?: Record<string, any> | null | undefined;
    }
  | undefined;

export type IPaginationBodyOutput = {
  page: number;
  limit: number;
  sortBy?: string | null | undefined;
  sortOrder?: "asc" | "ascending" | "desc" | "descending" | null | undefined;
  filters?: Record<string, any> | null | undefined;
};
