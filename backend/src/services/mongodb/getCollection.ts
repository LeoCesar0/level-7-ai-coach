import { IUser } from "@common/schemas/user/user";
import { mongoDBClient } from "../../lib/mongodb";
import { MongooseServer } from "../../lib/mongoose";
import { type Document } from "mongodb";

export type IGetCollection = {
  name: string;
};

export const getCollection = <T extends Document>({ name }: IGetCollection) => {
  const dbName = MongooseServer.dbName;
  const collection = mongoDBClient.db(dbName).collection<T>(name);
  return collection;
};
