// import { getCollection } from "@/services/mongodb/getCollection";
// import { IUser } from "@common/schemas/user/user";
// import { AnyObject } from "mongoose";

// export type IHandleSearch<T> = {
//   searchQuery: string;
//   collectionName: string;
//   searchIndexName: string;
//   fields: (keyof T)[];
//   limit?: number;
// };

// export const handleSearchAutocomplete = async <T extends AnyObject>({
//   collectionName,
//   searchQuery,
//   searchIndexName,
//   fields,
//   limit = 10,
// }: IHandleSearch<T>) => {
//   const collection = getCollection<T>({ name: collectionName });

//   const pipeline = [];

//   pipeline.push({
//     $search: {
//       index: searchIndexName,
//       // https://www.mongodb.com/docs/atlas/atlas-search/autocomplete/#options
//       autocomplete: {
//         query: searchQuery,
//         path: fields[0],
//         tokenOrder: "sequential",
//       },
//     },
//   });

//   const result = collection
//     .aggregate(pipeline)
//     .sort({ score: -1 })
//     .limit(limit);
//   const array = await result.toArray();
//   return array as T[];
// };
