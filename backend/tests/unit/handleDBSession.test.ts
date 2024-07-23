import { ENV } from "@common/static/envs";
import { handleDBSession } from "../../src/handlers/handleDBSession";
import { slugify } from "../../src/helpers/slugify";
import { MongooseServer } from "../../src/lib/mongoose";
import { ArchetypeModel } from "../../src/routes/archetype/schemas/archetype";

describe("handleDBSession unit suite", () => {
  let itemName = "handleDBSession TEST";
  let itemName1 = itemName + " 1";
  let itemName2 = itemName + " 2";

  let slug = "slug-test-handle-db-session";

  beforeAll(async () => {
    // await TestServer.connectTestServer();
    if (process.env.NODE_ENV !== ENV.TEST) {
      throw new Error("NODE_ENV is not TEST");
    }
    await MongooseServer.connectServer();
  });

  afterAll(async () => {
    // await TestServer.disconnectTestServer();
    await MongooseServer.disconnectServer();
  });

  beforeEach(async () => {
    await ArchetypeModel.deleteMany();
  });

  it("should ensure item is created when expected", async () => {
    await ArchetypeModel.create({
      name: itemName,
      birthDate: 123123,
      slug: slug,
    }).catch(() => {});

    let createdItem = await ArchetypeModel.findOne({ name: itemName });

    expect(createdItem).toBeFalsy();

    await ArchetypeModel.create({
      name: itemName,
      slug: slug,
      description: "desc",
    });

    createdItem = await ArchetypeModel.findOne({ name: itemName });

    expect(createdItem).toBeTruthy();
  });
  it("should insert", async () => {
    try {
      await handleDBSession(async (session) => {
        await ArchetypeModel.create(
          [
            {
              name: itemName1,
              slug: slug,
              description: "desc",
            },
          ],
          { session }
        );

        await ArchetypeModel.create(
          [
            {
              name: itemName2,
              slug: slugify(itemName2),
              description: "desc",
            },
          ],
          { session }
        );
      });
    } catch (err) {}

    const createdItem1 = await ArchetypeModel.findOne({ name: itemName1 });
    const createdItem2 = await ArchetypeModel.findOne({ name: itemName2 });

    expect(createdItem1).toBeTruthy();
    expect(createdItem2).toBeTruthy();
  });
  it("should not insert, one of two are invalid", async () => {
    try {
      await handleDBSession(async (session) => {
        await ArchetypeModel.create(
          [
            {
              name: itemName1,
              slug: slug,
              description: "desc",
            },
          ],
          { session }
        );

        await ArchetypeModel.create(
          [
            {
              name: itemName2,
              birthDate: 123123,
              slug: "slug-test-handle-db-session",
            },
          ],
          { session }
        );
      });
    } catch (err) {}

    const createdItem1 = await ArchetypeModel.findOne({ name: itemName1 });
    const createdItem2 = await ArchetypeModel.findOne({ name: itemName2 });

    expect(createdItem1).toBeFalsy();
    expect(createdItem2).toBeFalsy();
  });
});
