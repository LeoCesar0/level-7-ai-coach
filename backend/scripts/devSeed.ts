import dotenv from "dotenv";
import { ENV } from "../src/static/envs";
import { OrganizationModel } from "../src/routes/organizations/schemas/organization";
import { slugify } from "../src/helpers/slugify";
import { createAppUser } from "../src/services/createAppUser";
import { firebaseAuth } from "../src/lib/firebase";
import { UserModel } from "../src/routes/users/schemas/user";
import { MongooseServer } from "../src/lib/mongoose";
import { UserRecord } from "firebase-admin/auth";
// import { MessageModel } from "../src/routes/chat/schemas/message";
import { ChatModel } from "../src/routes/chat/schemas/chat";
import { getCollection } from "../src/services/mongodb/getCollection";
import {
  HISTORY_COLLECTION,
  MEMORY_COLLECTION,
} from "../src/lib/langchain/@static";
import { mongoDBClient } from "../src/lib/mongodb";
import { ICreateArchetype } from "../src/routes/archetype/schemas/createArchetype";
import { ArchetypeModel } from "../src/routes/archetype/schemas/archetype";
import { AssessmentModel } from "../src/routes/assessment/schemas/assessment";
import historySeed from "./data/dev/history.json";
import memorySeed from "./data/dev/memory.json";
import { IHistory } from "../src/@schemas/history";
import { IMemoryMessage } from "../src/@schemas/memory";
import { ObjectId } from "mongodb";

dotenv.config({ path: "../.env" });

export const seedArchetypes: ICreateArchetype[] = [
  {
    name: "The Rising Star",
    slug: "the-rising-star",
    description:
      "Young athletes with high potential benefit significantly from targeted development and motivational strategies. Focusing on their growth and skill enhancement can help them reach their peak performance early and sustain it over time.",
  },
  {
    name: "The Consistent Performer",
    slug: "the-consistent-performer",
    description:
      "Athletes who maintain a steady level of high performance require strategies to prevent burnout and maintain motivation. Ensuring they have the support to fine-tune their skills can help them stay at the top of their game for longer periods.",
  },
  {
    name: "The Comeback Athlete",
    slug: "the-comeback-athlete",
    description:
      "Rehabilitation and mental resilience are crucial for athletes recovering from injuries or poor performance. Tailored rehabilitation programs and mental toughness training can aid in their gradual return to peak condition​(PLOS)​​ (ERIC)​.",
  },
  {
    name: "The Resilient Achiever",
    slug: "the-resilient-achiever",
    description:
      "Mental toughness and resilience are essential traits for overcoming setbacks and adapting to adversity. Focusing on building these qualities can enhance an athlete's ability to perform under pressure and maintain their determination through challenges​(Verywell Fit).",
  },
  {
    name: "The Adaptable Innovator",
    slug: "the-adaptable-innovator",
    description:
      "Athletes who quickly adapt to new training methods and techniques can stay ahead of the curve. Encouraging experimentation with new approaches and evaluating their effectiveness can lead to continuous improvement and innovation in their performance​(ERIC)​.",
  },
  {
    name: "The Focused Visionary",
    slug: "the-focused-visionary",
    description:
      "Athletes with a clear long-term vision and disciplined approach benefit from setting ambitious goals and maintaining motivation. Long-term planning and goal-setting can help these athletes stay on track and achieve their dreams.",
  },
];

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
  // await MessageModel.deleteMany();
  await ChatModel.deleteMany();
  await ArchetypeModel.deleteMany();
  await AssessmentModel.deleteMany();

  const historyCol = getCollection({ name: HISTORY_COLLECTION });
  await historyCol.deleteMany();
  const memoryCol = getCollection({ name: MEMORY_COLLECTION });
  await memoryCol.deleteMany();

  // --------------------------
  // ARCHETYPES
  // --------------------------

  await ArchetypeModel.insertMany(seedArchetypes);

  const defaultArch = await ArchetypeModel.findOne({
    slug: seedArchetypes[0].slug,
  });

  if (!defaultArch) {
    throw new Error("Archetype not created");
  }

  // --------------------------
  // ADMIN
  // --------------------------

  const organizationMaster = await OrganizationModel.create({
    name: "Organization Master Dev",
    active: true,
    slug: slugify("Organization Master Dev"),
    _id: "6689cd9863d2aa5bbcffc9ef",
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
  // console.log("firebaseAdmin", firebaseAdmin);
  const admin = await createAppUser({
    inputs: {
      password: process.env.DEV_PASSWORD!,
      user: {
        active: true,
        name: adminName,
        role: "admin",
        email: adminEmail,
        organization: organizationMaster._id,
        _id: "6689cceacc04b2814e51629b",
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
    _id: "6689cd9963d2aa5bbcffc9f4",
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
        archetype: defaultArch._id,
        _id: "6689cd9963d2aa5bbcffc9f6",
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
        _id: "6689cd9a63d2aa5bbcffc9f9",
      },
    },
    firebaseId: firebaseCoach.uid,
  });

  // console.log("❗ admin -->", admin);

  // --------------------------
  // CHAT
  // --------------------------

  const chat = (
    await ChatModel.create({
      user: normalUser._id,
      date: new Date().toISOString(),
      _id: "6689d09602953bab4d753649",
    })
  ).toObject();

  const historyItem: Omit<IHistory, "_id"> = {
    ...historySeed,
    sessionId: chat._id.toString(),
  };
  await historyCol.insertOne(historyItem);

  const memoryMessages: Omit<IMemoryMessage, "_id">[] = memorySeed.map(
    (item: any) => {
      // delete item._id;
      return {
        ...item,
        chat_id: chat._id.toString(),
        user_id: normalUser._id.toString(),
        _id: ObjectId.createFromHexString(item._id),
      };
    }
  );
  await memoryCol.insertMany(memoryMessages);

  await MongooseServer.disconnectServer();
  await mongoDBClient.close();
};

await run();
