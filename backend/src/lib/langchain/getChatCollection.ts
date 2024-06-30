import { mongoDBClient } from "../mongodb";
import { MongooseServer } from "../mongoose";

export const getChatCollection = () => {
  const dbName = MongooseServer.dbName;
  const collectionName = "memory";
  const collection = mongoDBClient.db(dbName).collection(collectionName);
  return collection;
};
