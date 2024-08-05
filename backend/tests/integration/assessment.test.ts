import { ChatModel } from "@/routes/chat/schemas/chat";
import { JournalModel } from "@/routes/journals/schemas/journal";
import { getChatsToAssess } from "@/services/assessment/processChatsAssessment";
import { subHours } from "date-fns";
import Sinon from "sinon";
import { ISeedResult, TestServer } from "tests/mongodb-memory-server";

describe("Assessment integration test suite #current", () => {
  let _seed: ISeedResult;
  let stub: sinon.SinonStub<any>;

  beforeAll(async () => {
    await TestServer.connectTestServer();
    _seed = (await TestServer.seedTestServer())!;
  });

  afterAll(async () => {
    await TestServer.disconnectTestServer();
  });

  afterEach(() => {
    if (stub) {
      stub.restore();
    }
  });

  describe("chat assessments - getChatsToAssess", () => {
    it("should get only the correct chats to assess", async () => {
      const existingChats = await ChatModel.find();

      expect(existingChats.length).toBe(0);

      let now = new Date();

      const clock = Sinon.useFakeTimers({
        now: now,
      });

      const closedChat = await ChatModel.create({
        closed: true,
        assessed: false,
        date: now,
        user: _seed.normalUser._id,
      });
      const closedChat2 = await ChatModel.create({
        closed: true,
        date: now,
        user: _seed.normalUser._id,
      });
      const closedAndAssessedChat = await ChatModel.create({
        closed: true,
        assessed: true,
        date: now,
        user: _seed.normalUser._id,
      });
      const openChat = await ChatModel.create({
        closed: false,
        assessed: false,
        date: now,
        user: _seed.normalUser._id,
      });

      const openAndAssessedChat = await ChatModel.create({
        closed: false,
        assessed: true,
        date: now,
        user: _seed.normalUser._id,
      });

      let list = await getChatsToAssess();

      let listIds = list.map((item) => item._id.toString());

      // --------------------------
      // Expect to exclude
      // --------------------------
      expect(
        listIds.includes(closedAndAssessedChat._id.toString())
      ).toBeFalsy();
      expect(listIds.includes(openChat._id.toString())).toBeFalsy();
      expect(listIds.includes(openAndAssessedChat._id.toString())).toBeFalsy();

      // --------------------------
      // Expect to include
      // --------------------------
      expect(listIds.includes(closedChat._id.toString())).toBeTruthy();
      expect(listIds.includes(closedChat2._id.toString())).toBeTruthy();

      expect(list.length).toBe(2);

      // --------------------------
      // 24 hours passed
      // --------------------------

      clock.tick(1000 * 60 * 60 * 24);

      now = new Date();

      list = await getChatsToAssess();

      listIds = list.map((item) => item._id.toString());

      expect(listIds.includes(openChat._id.toString())).toBeTruthy();

      expect(listIds.includes(openAndAssessedChat._id.toString())).toBeFalsy();

      expect(list.length).toBe(3);

      clock.restore();
    });
  });
});
