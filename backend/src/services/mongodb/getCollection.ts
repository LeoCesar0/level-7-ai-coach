import { mongoDBClient } from "../../lib/mongodb";
import { MongooseServer } from "../../lib/mongoose";

export type IGetCollection = {
  name: string;
};

export const getCollection = ({ name }: IGetCollection) => {
  const dbName = MongooseServer.dbName;
  const collection = mongoDBClient.db(dbName).collection(name);
  return collection;
};
