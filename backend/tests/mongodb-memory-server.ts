import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import { MongooseServer } from "../src/lib/mongoose";
import { OrganizationModel } from "../src/routes/organizations/schemas/organization";
import { createAppUser } from "../src/services/createAppUser";
import { slugify } from "../src/helpers/slugify";
import { ENV } from "@common/static/envs";
import { IOrganization } from "@common/schemas/organization/organization";
import { parseUserDoc } from "@/helpers/parseUserDoc";
import { IUser } from "@common/schemas/user/user";
import { ChatCard } from "../../frontend/.nuxt/components";

type IConnectTestServer = {
  CONNECT_REAL_SERVER?: boolean;
};

export type ISeedResult = {
  organizationMaster: IOrganization;
  organization1: IOrganization;
  organization2: IOrganization;
  admin: IUser;
  normalUser: IUser;
  normalUser2: IUser;
  coachUser: IUser;
  coachUser2: IUser;
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
      adminOrganization: true,
    });

    const admin = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          name: "Admin Test",
          role: "admin",
          email: "test_admin_lvl7@level7.com",
          organization: organizationMaster._id.toString(),
        },
      },
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
          name: "user_test " + now,
          role: "user",
          email: now + "test_user@level7.com",
          organization: organization1._id.toString(),
        },
      },
    });
    const coachUser = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          name: "coach_test " + now,
          role: "coach",
          email: now + "test_coach@level7.com",
          organization: organization1._id.toString(),
        },
      },
    });

    // --------------------------
    // TEAM 2
    // --------------------------
    const organization2 = await OrganizationModel.create({
      name: "Team 2 Water Test",
      active: true,
      slug: slugify("Team 2 Water Test"),
    });
    const normalUser2 = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          name: "user_test " + now,
          role: "user",
          email: now + "test_user2@level7.com",
          organization: organization2._id.toString(),
        },
      },
    });
    const coachUser2 = await createAppUser({
      inputs: {
        password: "whatever",
        user: {
          name: "coach_test " + now,
          role: "coach",
          email: now + "test_coach2@level7.com",
          organization: organization2._id.toString(),
        },
      },
    });

    const result: ISeedResult = {
      organizationMaster: organizationMaster.toObject(),
      organization1: organization1.toObject(),
      admin: parseUserDoc(admin),
      normalUser: parseUserDoc(normalUser),
      coachUser: parseUserDoc(coachUser),
      adminTestToken: this.adminTestToken,
      normalUserTestToken: this.normalUserTestToken,
      coachUserTestToken: this.normalUserTestToken,
      coachUser2: parseUserDoc(coachUser2),
      normalUser2: parseUserDoc(normalUser2),
      organization2: organization2.toObject(),
    };

    Object.entries(result).forEach(([key, value]) => {
      if (!value) {
        throw new Error(`Seed failed for ${key}`);
      }
    });

    return result;
  };
}
