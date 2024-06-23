import Mongoose from "mongoose";
import { ENV } from "../static/envs";

const env = process.env.NODE_ENV || ENV.DEVELOPMENT;

export class MongooseServer {
  static connection: Mongoose.Connection | undefined;

  static connectServer = async () => {
    if (this.connection) {
      await this.disconnectServer();
    }
    const connectionString = this.getConnectionString();
    await Mongoose.connect(connectionString)
      .then(() => {
        console.log("Connected to MongoDB, env: ", env);
        this.connection = Mongoose.connection;
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB: ", err.message);
      });
  };

  static disconnectServer = async () => {
    await Mongoose.disconnect();
    this.connection = undefined;
  };

  static getConnectionString = () => {
    let connectionString = process.env.MONGO_DB_CONNECTION_STRING!;
    if (!connectionString?.endsWith("/")) {
      connectionString = connectionString + "/";
    }
    const [p1] = connectionString.split("mongodb.net/");
    connectionString = p1 + "mongodb.net/";

    connectionString = connectionString + `${env}`;
    const complement = process.env.MONGO_DB_CONNECTION_STRING_COMPLEMENT || "";
    connectionString = connectionString + complement;
    return connectionString;
  };
}
