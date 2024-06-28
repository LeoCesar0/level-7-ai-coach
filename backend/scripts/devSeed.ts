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
  const adminToken = await firebaseAuth.createCustomToken(firebaseAdmin.uid);
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
    withFirebaseUser: false,
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
  const userToken = await firebaseAuth.createCustomToken(firebaseUser.uid);

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
    withFirebaseUser: false,
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
  const coachToken = await firebaseAuth.createCustomToken(firebaseCoach.uid);
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
    withFirebaseUser: false,
    firebaseId: firebaseCoach.uid,
  });

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

  console.log("user token --> ", userToken);
  console.log("--------------------");
  console.log("coach token --> ", coachToken);
  console.log("--------------------");
  console.log("admin token --> ", adminToken);

  console.log("Finish seed");
  await MongooseServer.disconnectServer();
};

await run();
