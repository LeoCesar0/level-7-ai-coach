import Mongoose from "mongoose";
import dotenv from "dotenv";
import { ENV } from "@common/static/envs";

dotenv.config({ path: "../.env" });

const env = process.env.NODE_ENV || ENV.DEVELOPMENT;

export class MongooseServer {
  static connection: Mongoose.Connection | undefined;
  static dbName: string = env;

  static connectServer = async () => {
    if (this.connection) {
      console.log(
        "Already connected to MongoDB, disconnecting previous server"
      );
      await this.disconnectServer();
    }
    const connectionString = this.getConnectionString();
    await Mongoose.connect(connectionString)
      .then(() => {
        console.log(`🖥️ 🌏 Connected to MongoDB env: ${env}`);
        this.connection = Mongoose.connection;
      })
      .catch((err) => {
        console.error("Error connecting to MongoDB: ", err.message);
      });
  };

  static disconnectServer = async () => {
    console.log("🔌 MongoDB Server disconnecting");
    await Mongoose.disconnect();
    this.connection = undefined;
  };

  static getConnectionString = () => {

    // const string = `mongodb://${MONGO_DB_USER}:${MONGO_DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`

    let connectionString = process.env.MONGO_DB_CONNECTION_STRING!;
    if (!connectionString) {
      throw new Error("Mongo db connection string is not set");
    }
    if (!connectionString?.endsWith("/")) {
      connectionString = connectionString + "/";
    }
    // const [p1] = connectionString.split("mongodb.net/");
    // console.log("❗ p1 -->", p1);
    // connectionString = p1 + "mongodb.net/";

    connectionString = connectionString + this.dbName; // DB NAME

    const complement = process.env.MONGO_DB_CONNECTION_STRING_COMPLEMENT || "";
    connectionString = connectionString + complement;
    return connectionString;
  };
}
