import { handleDBSession } from "../../src/handlers/handleDBSession";
import { MongooseServer } from "../../src/lib/mongoose";
import { ArchetypeModel } from "../../src/routes/archetype/schemas/archetype";
import { ISeedResult, TestServer } from "../mongodb-memory-server";

describe("handleDBSession unit suite", () => {
  let _seed: ISeedResult;

  let itemName = "handleDBSession TEST";
  let itemName1 = itemName + " 1";
  let itemName2 = itemName + " 2";

  let slug = "slug-test-handle-db-session";

  beforeAll(async () => {
    await TestServer.connectTestServer();
    _seed = (await TestServer.seedTestServer())!;
  });

  afterAll(async () => {
    await TestServer.disconnectTestServer();
  });

  it("should ensure item is created when expected", async () => {
    await ArchetypeModel.create({
      name: itemName,
      birthday: 123123,
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

    await ArchetypeModel.deleteOne({ _id: createdItem?._id });
  });
  it("should handle db session", async () => {
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
              birthday: 123123,
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
