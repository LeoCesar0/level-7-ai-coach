import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ENV } from "../src/static/envs";

// This will create an new instance of "MongoMemoryServer" and automatically start it

export class TestServer {
  static testServer: MongoMemoryServer | undefined;

  static connectTestServer = async () => {
    if (process.env.NODE_ENV !== ENV.TEST) {
      return;
    }

    if (this.testServer) {
      await this.disconnectTestServer();
    }

    this.testServer = await MongoMemoryServer.create();

    const uri = this.testServer.getUri();

    await mongoose.connect(uri);
    console.log("Connected to mongoDB memory server");
  };

  static disconnectTestServer = async () => {
    if (process.env.NODE_ENV !== ENV.TEST) {
      return;
    }
    if (this.testServer) {
      await mongoose.disconnect();
      await this.testServer.stop();
    }
  };
}
