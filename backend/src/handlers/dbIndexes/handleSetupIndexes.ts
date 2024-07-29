import { COLLECTION } from "@/lib/langchain/@static";
import { MongooseServer } from "@/lib/mongoose";
import { getCollection } from "@/services/mongodb/getCollection";
import { request } from "urllib";
import { upsertUserSearchIndex } from "./upsertUserSearchIndex";

export const handleSetupIndexes = async () => {
  // --------------------------
  // USER SEARCH INDEX
  // --------------------------
  await upsertUserSearchIndex();
};

// export const handleSetupIndexes = async () => {
//   // --------------------------
//   // USER SEARCH INDEX
//   // --------------------------
//   const indexName = "user_search_index";
//   const userCollections = getCollection({ name: COLLECTION.USERS });

//   const exists = await userCollections.indexExists(indexName);
//   if (exists) {
//     console.log("🟢 Index already exists:", indexName);
//   } else {
//     console.log("🟡 Creating index:", indexName);
//     const indexResult = await userCollections.createIndexes([
//       {
//         name: indexName,
//         key: {
//           name: "text",
//           email: "text",
//         },
//       },
//     ]);
//     console.log("❗ indexResult -->", indexResult);
//   }
// };
