import { MongoClient } from "mongodb";
import { MongooseServer } from "./mongoose";

const connectionString = MongooseServer.getConnectionString();

export const mongoDBClient = new MongoClient(connectionString);
