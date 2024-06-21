import Mongoose from "mongoose";

export class MongooseServer {
  static connection: Mongoose.Connection | undefined;

  static connectServer = async () => {
    if (this.connection) {
      await this.disconnectServer();
    }

    Mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING!)
      .then(() => {
        console.log("Connected to MongoDB");
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
}
