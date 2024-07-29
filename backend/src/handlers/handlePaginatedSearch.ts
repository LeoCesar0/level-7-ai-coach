import { getCollection } from "@/services/mongodb/getCollection";
import { IPaginationResult } from "@common/schemas/pagination";
import { IUser } from "@common/schemas/user/user";
import { AnyObject } from "mongoose";

export type IHandlePaginatedSearch<T> = {
  searchQuery: string;
  collectionName: string;
  searchIndexName: string;
  fields: (keyof T)[];
  page?: number;
  limit?: number;
};

export const handlePaginatedSearch = async <T extends AnyObject>({
  collectionName,
  searchQuery,
  searchIndexName,
  fields,
  page = 1,
  limit = 10,
}: IHandlePaginatedSearch<T>): Promise<IPaginationResult<T>> => {
  const collection = getCollection<T>({ name: collectionName });
  const skip = (page - 1) * limit;

  const pipeline = [
    {
      $search: {
        index: searchIndexName,
        compound: {
          must: [
            {
              text: {
                query: searchQuery,
                path: fields,
                fuzzy: {},
              },
            },
          ],
        },
      },
    },
    {
      $facet: {
        metadata: [{ $count: "totalItems" }],
        data: [{ $sort: { score: -1 } }, { $skip: skip }, { $limit: limit }],
      },
    },
    { $unwind: "$metadata" },
  ];

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
