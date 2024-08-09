import dotenv from "dotenv";
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
  COLLECTION,
  HISTORY_COLLECTION,
  MEMORY_COLLECTION,
} from "../src/lib/langchain/@static";
import { mongoDBClient } from "../src/lib/mongodb";
import { AssessmentModel } from "../src/routes/assessment/schemas/assessment";
import historySeed from "./data/dev/history.json";
import memorySeed from "./data/dev/memory.json";
import { IHistory } from "../src/@schemas/history";
import { IMemoryMessage } from "../src/@schemas/memory";
import { ObjectId } from "mongodb";
import { JournalModel } from "../src/routes/journals/schemas/journal";
import { ENV } from "@common/static/envs";
import { ICreateArchetype } from "@common/schemas/archetype/createArchetype";
import { ArchetypeModel } from "@/routes/archetype/schemas/archetype";
import { faker } from "@faker-js/faker";
import { IRole } from "@common/schemas/roles";
import { clamp } from "../../common/helpers/clamp";
import { zAssessmentKey } from "@common/schemas/assessment/enums";
import { addDays, differenceInBusinessDays, subMonths } from "date-fns";
import { getRandomOfArray } from "../../common/test/helpers/getRandomOfArray";
import { ATHLETE_QUESTIONS } from "@common/schemas/user/athleteInfo";

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
  const devPassword = process.env.DEV_PASSWORD!;

  await MongooseServer.connectServer();

  console.log("🌱 Starting dev seed");

  await OrganizationModel.deleteMany();
  await UserModel.deleteMany();
  // await MessageModel.deleteMany();
  await ChatModel.deleteMany();
  await ArchetypeModel.deleteMany();
  await AssessmentModel.deleteMany();
  await JournalModel.deleteMany();

  const historyCol = getCollection({ name: HISTORY_COLLECTION });
  await historyCol.deleteMany();
  const memoryCol = getCollection({ name: MEMORY_COLLECTION });
  await memoryCol.deleteMany();

  const userAnalytics = getCollection({ name: COLLECTION.USER_ANALYTICS });
  await userAnalytics.deleteMany();

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
    adminOrganization: true,
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
      password: devPassword,
    });
  }
  // console.log("firebaseAdmin", firebaseAdmin);
  const admin = await createAppUser({
    inputs: {
      password: devPassword,
      user: {
        name: adminName,
        role: "admin",
        email: adminEmail,
        organization: organizationMaster._id.toString(),
        _id: "6689cceacc04b2814e51629b",
      },
    },
    firebaseId: firebaseAdmin.uid,
  });

  // --------------------------
  // USER
  // --------------------------

  const teamLiquidFire = await OrganizationModel.create({
    name: "Team Liquid Fire",
    active: true,
    slug: slugify("Team Fire Dev"),
    _id: "6689cd9963d2aa5bbcffc9f4",
  });

  const teamBoltz = await OrganizationModel.create({
    name: "Team Boltz",
    active: true,
    slug: slugify("Team Boltz"),
  });

  const normalUserEmail = "dev_user@level7.com";
  const normalUserName = "John Doe";
  let firebaseUser = await firebaseAuth
    .getUserByEmail(normalUserEmail)
    .catch((err) => {});
  if (!firebaseUser) {
    firebaseUser = await firebaseAuth.createUser({
      displayName: normalUserName,
      email: normalUserEmail,
      password: devPassword,
    });
  }

  const normalUser = await createAppUser({
    inputs: {
      password: devPassword,
      user: {
        name: normalUserName,
        role: "user",
        email: normalUserEmail,
        organization: teamLiquidFire._id.toString(),
        // archetype: defaultArch._id.toString(),
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
      password: devPassword,
    });
  }
  const coachUser = await createAppUser({
    inputs: {
      password: devPassword,
      user: {
        name: coachUserName,
        role: "coach",
        email: coachUserEmail,
        organization: teamLiquidFire._id.toString(),
        _id: "6689cd9a63d2aa5bbcffc9f9",
      },
    },
    firebaseId: firebaseCoach.uid,
  });

  // console.log("❗ admin -->", admin);

  // --------------------------
  // SEED RANDOM USERS
  // --------------------------

  const createRandomUser = async ({
    index,
    teamId,
    role,
    teamName = "random",
    userName,
  }: {
    role: IRole;
    teamId: string;
    index: number;
    teamName?: string;
    userName?: string;
  }) => {
    const randomUserEmail = `${
      userName ? slugify(userName) : "dev"
    }_${teamName}_${role}_${index}_@test.com`;
    const randomUserName = userName ?? faker.person.fullName();
    let firebaseRandomUser = await firebaseAuth
      .getUserByEmail(randomUserEmail)
      .catch((err) => {});

    if (!firebaseRandomUser) {
      firebaseRandomUser = await firebaseAuth.createUser({
        displayName: randomUserName,
        email: randomUserEmail,
        password: devPassword,
      });
    }
    const fakePhone = Math.random() > 0.5;
    const fakeAddress = Math.random() > 0.5;
    const fakeBirth = Math.random() > 0.5;

    const randomUser = await createAppUser({
      inputs: {
        password: devPassword,
        user: {
          name: randomUserName,
          role: role,
          email: randomUserEmail,
          organization: teamId,
          address: fakeAddress
            ? {
                address: faker.location.streetAddress(),
                city: "Nashville",
                state: "Tennessee",
                country: "USA",
              }
            : undefined,
          phone: fakePhone ? faker.phone.number() : undefined,
          birthDate: fakeBirth ? new Date(2000, 1, 1) : undefined,
        },
      },
      firebaseId: firebaseRandomUser.uid,
    });
    console.log("❗created randomUser -->", randomUserName);
    return randomUser;
  };

  // --------------------------
  // Create random coaches
  // --------------------------

  await createRandomUser({
    index: 150,
    role: "coach",
    teamId: teamLiquidFire._id.toString(),
  });
  await createRandomUser({
    index: 250,
    role: "coach",
    teamId: teamBoltz._id.toString(),
  });

  // --------------------------
  // Create disabled users
  // --------------------------
  const disabledUser = await createRandomUser({
    index: 344,
    role: "user",
    teamId: teamLiquidFire._id.toString(),
    userName: "disabled user",
  });
  await UserModel.updateOne({ _id: disabledUser._id }, { active: false });
  const disabledCoach = await createRandomUser({
    index: 344,
    role: "coach",
    teamId: teamLiquidFire._id.toString(),
    userName: "disabled coach",
  });
  await UserModel.updateOne({ _id: disabledCoach._id }, { active: false });

  // --------------------------
  // Create random users
  // --------------------------
  const promises: Promise<any>[] = [];

  for (let i = 0; i < 5; i++) {
    // team liquid fier and random names
    const promise = createRandomUser({
      index: i,
      role: "user",
      teamId: teamLiquidFire._id.toString(),
      teamName: "fire",
    });
    // promises.push(promise);
    await promise;
  }
  for (let i = 0; i < 12; i++) {
    // team liquid fier and similar names
    const promise = createRandomUser({
      index: i,
      role: "user",
      teamId: teamLiquidFire._id.toString(),
      teamName: "fire",
      userName: "Johnny Doe " + i,
    });
    // promises.push(promise);
    await promise;
  }
  for (let i = 0; i < 10; i++) {
    const promise = createRandomUser({
      index: i,
      role: "user",
      teamId: teamBoltz._id.toString(),
      teamName: "boltz",
    });
    // promises.push(promise);
    await promise;
  }

  await Promise.all(promises);

  // --------------------------
  // CHAT
  // --------------------------

  // const chat = (
  //   await ChatModel.create({
  //     user: normalUser._id,
  //     date: new Date().toISOString(),
  //     _id: "6689d09602953bab4d753649",
  //   })
  // ).toObject();

  // const historyItem: Omit<IHistory, "_id"> = {
  //   ...historySeed,
  //   sessionId: chat._id.toString(),
  // };
  // await historyCol.insertOne(historyItem);

  // const memoryMessages: Omit<IMemoryMessage, "_id">[] = memorySeed.map(
  //   (item: any) => {
  //     // delete item._id;
  //     return {
  //       ...item,
  //       chat_id: chat._id.toString(),
  //       user_id: normalUser._id.toString(),
  //       _id: ObjectId.createFromHexString(item._id),
  //     };
  //   }
  // );
  // await memoryCol.insertMany(memoryMessages);

  // --------------------------
  // ASSESSMENTS
  // --------------------------

  const now = new Date();
  const startingDate = subMonths(now, 1);
  const nDays = differenceInBusinessDays(now, startingDate);
  const assessmentsPerModule = 12;

  const assessmentUserId = normalUser._id;

  for (const dayIndex of Array.from({ length: nDays }).map(
    (_, index) => index
  )) {
    // For each day
    const day = addDays(startingDate, dayIndex);

    const chatOfTheDay = (
      await ChatModel.create({
        user: assessmentUserId,
        date: day,
        closed: true,
        assessed: true,
        createdAt: day,
        updatedAt: day,
      })
    ).toObject();

    const journalOfTheDay = (
      await JournalModel.create({
        user: assessmentUserId,
        date: day,
        assessed: true,
        shouldAssess: false,
        title: faker.lorem.sentence(),
        text: faker.lorem.text(),
        draft: false,
        createdAt: day,
        updatedAt: day,
      })
    ).toObject();

    for (const [modelIndex, model] of [
      chatOfTheDay,
      journalOfTheDay,
    ].entries()) {
      // For each model
      for (const assess of Array.from({ length: assessmentsPerModule })) {
        // Create N assessments
        const entryAssessmentKey = getRandomOfArray(zAssessmentKey.options);

        const found = ATHLETE_QUESTIONS.find(
          (item) => item.key === entryAssessmentKey
        );
        const section = found?.section || "others";

        await AssessmentModel.create({
          chat: modelIndex === 0 ? model._id : undefined,
          journal: modelIndex === 1 ? model._id : undefined,
          justification: faker.lorem.sentences(),
          value: clamp(Math.floor(Math.random() * 11), 0, 10),
          key: entryAssessmentKey,
          section: section,
          createdAt: day,
          updatedAt: day,
          date: day,
          user: assessmentUserId,
        });
      }
      // --------------------------
      // ALWAYS ADD THE FOLLOWING ASSESSMENT
      // --------------------------
      const _section = ATHLETE_QUESTIONS.find(
        (item) => item.key === "handlingFailure"
      )?.section;

      await AssessmentModel.create({
        chat: modelIndex === 0 ? model._id : undefined,
        journal: undefined,
        justification: faker.lorem.sentences(),
        value: clamp(Math.floor(Math.random() * 11), 0, 10),
        key: "motivationalFactors",
        section: _section ?? "others",
        createdAt: day,
        updatedAt: day,
        date: day,
        user: assessmentUserId,
      });
    }
  }

  // --------------------------

  await MongooseServer.disconnectServer();
  await mongoDBClient.close();
};

await run();
