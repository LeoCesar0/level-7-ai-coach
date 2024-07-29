import { MongooseServer } from "@/lib/mongoose";
import { ATLAS_SEARCH_INDEX_API_URL, DIGEST_AUTH } from "./setup";
import { request } from "urllib";


export async function findIndexByName(
  indexName: string,
  collectionName: string
) {
  const dbName = MongooseServer.dbName;

  const allIndexesResponse = await request(
    `${ATLAS_SEARCH_INDEX_API_URL}/${dbName}/${collectionName}`,
    {
      dataType: "json",
      contentType: "application/json",
      method: "GET",
      digestAuth: DIGEST_AUTH,
    }
  );

  return (allIndexesResponse.data as any[]).find((i) => i.name === indexName);
}
