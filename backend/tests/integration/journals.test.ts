import { AppResponse } from "@common/schemas/app";
import honoApp from "../../src";
import { IPaginationResult } from "@common/schemas/pagination";

import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";
import { IJournal } from "@common/schemas/journal/journal";
import { ICreateJournal } from "@common/schemas/journal/createJournal";
import { parseUserToUserDoc } from "@/helpers/parseUserToUserDoc";

describe("journal integration suite", () => {
  console.log("🔻 Enter JOURNAL integration suite  -->");

  let _createdJournal: IJournal | null = null;
  let _journalText = "My first journal entry";
  let _journalUpdatedText = "Updated journal entry";

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

  describe("create", () => {
    it("should create a new journal entry, by user", async () => {
      stub = await stubGetUserFromToken(parseUserToUserDoc(_seed.normalUser));
      const date = new Date();
      const body: ICreateJournal = {
        date: date.toISOString(),
        text: _journalText,
        draft: false,
        images: [],
      };

      const res = await honoApp.request("/api/journals", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IJournal> = await res.json();
      const journal = json.data;

      if (json.error) {
        console.log("❌ Create journal error", json.error);
      }

      expect(res.status).toBe(200);
      expect(json.error).toBe(null);
      expect(journal?.text).toBe(_journalText);
      expect(typeof journal?.date).toBe("string");

      _createdJournal = journal;
    });
  });

  describe("list", () => {
    it("should list and find created journal entry", async () => {
      stub = await stubGetUserFromToken(parseUserToUserDoc(_seed.normalUser));

      const res = await honoApp.request("/api/journals/paginate", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IPaginationResult<IJournal>> = await res.json();
      const found = json.data?.list.find(
        (item) => item._id === _createdJournal?._id
      );

      expect(res.status).toBe(200);
      expect(found).toBeTruthy();
      expect(found?.text).toBe(_journalText);
    });
  });

  describe("get", () => {
    it("should get the created journal entry", async () => {
      if (!_createdJournal) {
        throw new Error("Journal not created");
      }
      stub = await stubGetUserFromToken(parseUserToUserDoc(_seed.normalUser));

      const res = await honoApp.request(
        `/api/journals/${_createdJournal._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IJournal> = await res.json();
      const journal = json.data;

      if (json.error) {
        console.log("❗ Get journal error -->", json.error);
      }

      expect(res.status).toBe(200);
      expect(journal?.text).toBe(_journalText);
    });
  });

  describe("update", () => {
    it("should update the journal entry", async () => {
      if (!_createdJournal) {
        throw new Error("Journal not created");
      }
      stub = await stubGetUserFromToken(parseUserToUserDoc(_seed.normalUser));

      const body: Partial<ICreateJournal> = {
        text: _journalUpdatedText,
        draft: false,
        images: [],
      };

      const res = await honoApp.request(
        `/api/journals/${_createdJournal._id}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IJournal> = await res.json();
      const journal = json.data;

      expect(res.status).toBe(200);
      expect(journal?.text).toBe(_journalUpdatedText);
    });
  });

  describe("delete", () => {
    it("should delete the journal entry", async () => {
      if (!_createdJournal) {
        throw new Error("Journal not created");
      }
      stub = await stubGetUserFromToken(parseUserToUserDoc(_seed.normalUser));

      const res = await honoApp.request(
        `/api/journals/${_createdJournal._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<boolean> = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toBe(true);
    });
  });
});
