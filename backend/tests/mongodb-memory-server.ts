import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { ENV } from "../src/static/envs";
import { MongooseServer } from "../src/lib/mongoose";
import {
  Organization,
  OrganizationModel,
} from "../src/routes/organizations/schemas/organization";
import { IUser } from "../src/routes/users/schemas/user";
import { createAppUser } from "../src/services/createAppUser";
import honoApp, { honoServer } from "../src";
import { slugify } from "../src/helpers/slugify";

type IConnectTestServer = {
  CONNECT_REAL_SERVER?: boolean;
};

export type SeedResult = {
  organizationMaster: Organization;
  organization1: Organization;
  admin: IUser;
  normalUser: IUser;
  coachUser: IUser;
  adminTestToken: string;
  normalUserTestToken: string;
  coachUserTestToken: string;
};

export class TestServer {
  static testServer: MongoMemoryServer | undefined;
  static adminTestToken: string = "12345admin";
  static normalUserTestToken: string = "12345user";
  static coachUserTestToken: string = "12345coach";

  static connectTestServer = async (
    props: IConnectTestServer | undefined = { CONNECT_REAL_SERVER: false }
  ) => {
    if (props.CONNECT_REAL_SERVER) {
      await MongooseServer.connectServer();
      return;
    }

    if (process.env.NODE_ENV !== ENV.TEST) {
      return;
    }

    if (this.testServer) {
      await this.disconnectTestServer();
    }
    this.testServer = await MongoMemoryServer.create();

    const uri = this.testServer.getUri();

    await mongoose.connect(uri);
    console.log("💻 Connected to test server");
  };

  static disconnectTestServer = async () => {
    if (process.env.NODE_ENV !== ENV.TEST) {
      return;
    }
    if (this.testServer) {
      console.log("🔌 Disconnecting test server");
      await mongoose.disconnect();
      await this.testServer.stop();
    }
  };

  static seedTestServer = async () => {
    if (process.env.NODE_ENV !== ENV.TEST) {
      throw new Error("Can't seed, not in test environment");
    }
    if (!this.testServer) {
      throw new Error("Can't seed, test server not connected");
    }

    console.log("🌱 Starting test seed");

    // --------------------------
    // ADMIN
    // --------------------------

    const organizationMaster = await OrganizationModel.create({
      name: "Organization Master Test",
      active: true,
      slug: slugify("Organization Master Test"),
    });

    const admin = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          active: true,
          name: "Admin Test",
          role: "admin",
          email: "test_admin_lvl7@level7.com",
          organization: organizationMaster._id,
        },
      },
      withFirebaseUser: false,
    });

    // --------------------------
    // USERS
    // --------------------------

    const organization1 = await OrganizationModel.create({
      name: "Team Fire Test",
      active: true,
      slug: slugify("Team Fire Test"),
    });
    const now = Date.now();
    const normalUser = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          active: true,
          name: "user_test " + now,
          role: "user",
          email: now + "test_user@level7.com",
          organization: organization1._id,
        },
      },
      withFirebaseUser: false,
    });
    const coachUser = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          active: true,
          name: "coach_test " + now,
          role: "coach",
          email: now + "test_coach@level7.com",
          organization: organization1._id,
        },
      },
      withFirebaseUser: false,
    });

    const result: SeedResult = {
      organizationMaster: organizationMaster.toObject(),
      organization1: organization1.toObject(),
      admin: admin,
      normalUser,
      coachUser,
      adminTestToken: this.adminTestToken,
      normalUserTestToken: this.normalUserTestToken,
      coachUserTestToken: this.normalUserTestToken,
    };

    Object.entries(result).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`Seed failed for ${key}`);
      }
    });

    return result;
  };
}
