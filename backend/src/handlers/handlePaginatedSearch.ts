import { IUserDoc } from "@/routes/users/schemas/user";
import { getCollection } from "@/services/mongodb/getCollection";
import { IPaginationBodyOutput } from "@common/schemas/paginateRoute";
import { IPaginationResult } from "@common/schemas/pagination";
import { IUser } from "@common/schemas/user/user";
import { AnyObject, FilterQuery, Model } from "mongoose";

export type IHandlePaginatedSearch<T> = {
  body: IPaginationBodyOutput;
  searchQuery: string;
  collectionName: string;
  searchIndexName: string;
  fields: (keyof T)[];
  populates?: {
    key: keyof T extends string ? keyof T : never;
    collectionName: string;
  };
  obligatoryFilters: FilterQuery<T>;
};

export const handlePaginatedSearch = async <T extends AnyObject>({
  collectionName,
  searchQuery,
  searchIndexName,
  fields,
  populates,
  body,
  obligatoryFilters,
}: IHandlePaginatedSearch<T>): Promise<IPaginationResult<T>> => {
  const collection = getCollection<T>({ name: collectionName });

  const limit = body.limit;
  const page = body.page;
  // const filters = body.filters;
  const skip = (page - 1) * limit;

  const filters: FilterQuery<T> = {
    ...(body.filters || {}),
    ...obligatoryFilters,
  };

  let queryArray = [
    {
      text: {
        query: searchQuery,
        path: fields,
        fuzzy: {},
      },
    },
  ];
  // if (body.filters) {
  //   Object.entries(body.filters).forEach(([key, value]) => {
  //     queryArray.push();
  //   });
  // }

  let pipeline: any[] = [
    {
      $search: {
        index: searchIndexName,
        compound: {
          must: queryArray,
        },
      },
    },
  ];
  if (filters && Object.values(filters).length > 0) {
    pipeline.push({
      $match: filters,
    });
  }
  if (populates) {
    pipeline = pipeline.concat([
      {
        $lookup: {
          from: populates.collectionName,
          localField: populates.key,
          foreignField: "_id",
          as: populates.key,
        },
      },
      {
        $unwind: {
          path: `$${populates.key}`,
          preserveNullAndEmptyArrays: true,
        },
      },
    ]);
  }
  pipeline = pipeline.concat([
    {
      $facet: {
        metadata: [{ $count: "totalItems" }],
        data: [{ $sort: { score: -1 } }, { $skip: skip }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ]);

  const result = await collection.aggregate(pipeline).toArray();
  const data = result[0] || { metadata: { totalItems: 0 }, data: [] };

  const totalItems = data.metadata.totalItems;
  const totalPages = Math.ceil(totalItems / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return {
    list: data.data as T[],
    totalItems,
    page,
    limit,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
  };
};
