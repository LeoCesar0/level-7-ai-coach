import dotenv from "dotenv";
import { ENV } from "../src/static/envs";
import { OrganizationModel } from "../src/routes/organizations/schemas/organization";
import { slugify } from "../src/helpers/slugify";
import { createAppUser } from "../src/services/createAppUser";
import { firebaseAuth } from "../src/lib/firebase";
import { UserModel } from "../src/routes/users/schemas/user";
import { MongooseServer } from "../src/lib/mongoose";
import { UserRecord } from "firebase-admin/auth";
import { MessageModel } from "../src/routes/chat/schemas/message";
import { ChatModel } from "../src/routes/chat/schemas/chat";
import { getCollection } from "../src/services/mongodb/getCollection";
import {
  HISTORY_COLLECTION,
  MEMORY_COLLECTION,
} from "../src/lib/langchain/@static";
import { mongoDBClient } from "../src/lib/mongodb";

dotenv.config({ path: "../.env" });

const run = async () => {
  if (process.env.NODE_ENV !== ENV.DEVELOPMENT) {
    throw new Error("Environment is different from " + ENV.DEVELOPMENT);
  }
  if (!process.env.DEV_PASSWORD) {
    throw new Error("Dev password env is not set");
  }

  await MongooseServer.connectServer();

  console.log("🌱 Starting dev seed");

  await OrganizationModel.deleteMany();
  await UserModel.deleteMany();
  await MessageModel.deleteMany();
  await ChatModel.deleteMany();

  const historyCol = getCollection({ name: HISTORY_COLLECTION });
  await historyCol.deleteMany();
  const memoryCol = getCollection({ name: MEMORY_COLLECTION });
  await memoryCol.deleteMany();

  // --------------------------
  // ADMIN
  // --------------------------

  const organizationMaster = await OrganizationModel.create({
    name: "Organization Master Dev",
    active: true,
    slug: slugify("Organization Master Dev"),
  });
  const adminEmail = "dev_admin_lvl7@level7.com";
  const adminName = "Admin dev";
  let firebaseAdmin = await firebaseAuth
    .getUserByEmail(adminEmail)
    .catch((err) => {});
  if (!firebaseAdmin) {
    firebaseAdmin = await firebaseAuth.createUser({
      email: adminEmail,
      displayName: adminName,
    });
  }
  console.log("firebaseAdmin", firebaseAdmin);
  const admin = await createAppUser({
    inputs: {
      password: process.env.DEV_PASSWORD!,
      user: {
        active: true,
        name: adminName,
        role: "admin",
        email: adminEmail,
        organization: organizationMaster._id,
      },
    },
    firebaseId: firebaseAdmin.uid,
  });

  // --------------------------
  // USER
  // --------------------------

  const organization1 = await OrganizationModel.create({
    name: "Team Fire Dev",
    active: true,
    slug: slugify("Team Fire Dev"),
  });
  const normalUserEmail = "dev_user@level7.com";
  const normalUserName = "User dev 1";
  let firebaseUser = await firebaseAuth
    .getUserByEmail(normalUserEmail)
    .catch((err) => {});
  if (!firebaseUser) {
    firebaseUser = await firebaseAuth.createUser({
      displayName: normalUserName,
      email: normalUserEmail,
    });
  }

  const normalUser = await createAppUser({
    inputs: {
      password: process.env.DEV_PASSWORD!,
      user: {
        active: true,
        name: normalUserName,
        role: "user",
        email: normalUserEmail,
        organization: organization1._id,
      },
    },
    firebaseId: firebaseUser.uid,
  });
  // --------------------------
  // COACH
  // --------------------------

  const coachUserEmail = "dev_coach@level7.com";
  const coachUserName = "Coach dev 1";
  let firebaseCoach = await firebaseAuth
    .getUserByEmail(coachUserEmail)
    .catch((err) => {});
  if (!firebaseCoach) {
    firebaseCoach = await firebaseAuth.createUser({
      displayName: coachUserName,
      email: coachUserEmail,
    });
  }
  const coachUser = await createAppUser({
    inputs: {
      password: process.env.DEV_PASSWORD!,
      user: {
        active: true,
        name: coachUserName,
        role: "coach",
        email: coachUserEmail,
        organization: organization1._id,
      },
    },
    firebaseId: firebaseCoach.uid,
  });

  console.log("❗ admin -->", admin);

  //   const result: SeedResult = {
  //     organizationMaster: organizationMaster.toObject(),
  //     organization1: organization1.toObject(),
  //     admin: admin,
  //     normalUser,
  //     coachUser,
  //     adminTestToken: this.adminTestToken,
  //     normalUserTestToken: this.normalUserTestToken,
  //     coachUserTestToken: this.normalUserTestToken,
  //   };

  console.log("Finish seed");
  await MongooseServer.disconnectServer();
  await mongoDBClient.close()
};

await run();
