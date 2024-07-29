import { COLLECTION } from "@/lib/langchain/@static";
import { MongooseServer } from "@/lib/mongoose";
import { findIndexByName } from "./findIndexByName";
import {
  ATLAS_SEARCH_INDEX_API_URL,
  DIGEST_AUTH,
  USER_SEARCH_INDEX_NAME,
} from "./setup";
import { request } from "urllib";

export async function upsertUserSearchIndex() {
  const dbName = MongooseServer.dbName;
  const collectionName = COLLECTION.USERS;

  const userSearchIndex = await findIndexByName(
    USER_SEARCH_INDEX_NAME,
    collectionName
  );
  if (userSearchIndex) {
    console.log("🟢 Index already exists:", USER_SEARCH_INDEX_NAME);
    return;
  }

  console.log("🟡 Creating index:", USER_SEARCH_INDEX_NAME);
  await request(ATLAS_SEARCH_INDEX_API_URL, {
    data: {
      name: USER_SEARCH_INDEX_NAME,
      database: dbName,
      collectionName: collectionName,
      // https://www.mongodb.com/docs/atlas/atlas-search/index-definitions/#syntax
      mappings: {
        dynamic: true,
      },
    },
    dataType: "json",
    contentType: "application/json",
    method: "POST",
    digestAuth: DIGEST_AUTH,
  });
}
