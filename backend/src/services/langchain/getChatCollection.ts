import { mongoDBClient } from "../../lib/mongodb";
import { MongooseServer } from "../../lib/mongoose";

export const getChatCollection = () => {
  const dbName = MongooseServer.dbName;
  const collectionName = "memory";
  const collection = mongoDBClient.db(dbName).collection(collectionName);
  return collection;
};
