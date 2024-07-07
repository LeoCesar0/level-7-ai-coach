import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IPaginationResult } from "../../src/@schemas/pagination";
import { slugify } from "../../src/helpers/slugify";
import {
  ArchetypeModel,
  IArchetype,
} from "../../src/routes/archetype/schemas/archetype";
import {
  ASSESSMENT_QUESTION,
  zAssessmentSection,
} from "../../src/routes/assessment/schemas/enums";

import { EXCEPTIONS } from "../../src/static/exceptions";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";
import { ICreateArchetype } from "../../src/routes/archetype/schemas/createArchetype";

describe("archetypes integration suite", () => {
  console.log("🔻 Enter ARCHETYPES integration suite  -->");

  let _createdArchetype: IArchetype | null = null;
  let _archetypeName = "The clown";
  let _archetypeUpdatedName = "The clown (updated)";

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
    // --------------------------
    // CREATE NEW ARCHETYPE
    // --------------------------
    it("should create a new archetype, by admin", async () => {
      // --------------------------
      // ARRANGE
      // --------------------------

      stub = await stubGetUserFromToken(_seed.admin);

      const body: ICreateArchetype = {
        description: "desc",
        name: _archetypeName,
        slug: "arch-name",
      };

      // --------------------------
      // ACT
      // --------------------------

      const res = await honoApp.request("/api/archetypes", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IArchetype> = await res.json();

      const archetype = json.data;

      if (json.error) {
        console.log("❌ Create archetype error", json.error);
      }

      // --------------------------
      // ASSERT
      // --------------------------

      expect(res.status).toBe(200);
      expect(json.error).toBe(null);
      expect(archetype?.name).toBe(_archetypeName);

      _createdArchetype = archetype;
    });

    // --------------------------
    // DENY CREATE SAME ARCHETYPE
    // --------------------------
    it("should not create archetype with same name, archetype exists", async () => {
      if (!_createdArchetype) {
        throw new Error("Archetype not created");
      }

      stub = await stubGetUserFromToken(_seed.admin);

      const body: ICreateArchetype = {
        description: "desc",
        name: _archetypeName,
        slug: "arch-name123123",
      };

      const res = await honoApp.request("/api/archetypes", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer any-token",
        },
      });

      const json: AppResponse<IArchetype> = await res.json();

      expect(res.status).toBe(400);
      expect(json.error?.message).toBe(EXCEPTIONS.ITEM_EXISTS("Archetype"));
    });
  });

  describe("list", () => {
    // --------------------------
    // LIST ARCHETYPE
    // --------------------------
    it("should list and find created archetype", async () => {
      stub = await stubGetUserFromToken(_seed.coachUser);

      const res = await honoApp.request("/api/archetypes/list", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IPaginationResult<IArchetype>> = await res.json();

      const found = json.data?.list.find(
        (item) => item._id === _createdArchetype?._id
      );

      expect(res.status).toBe(200);
      expect(found).toBeTruthy();
      expect(found?.name).toBeTruthy();
    });
  });

  describe("get", () => {
    // --------------------------
    // GET ARCHETYPE
    // --------------------------
    it("should get the created archetype", async () => {
      if (!_createdArchetype) {
        throw new Error("Archetype not created");
      }
      stub = await stubGetUserFromToken(_seed.normalUser);

      const res = await honoApp.request(
        `/api/archetypes/${_createdArchetype._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IArchetype> = await res.json();

      if (json.error) {
        console.log("❗ get archetype error -->", json.error);
      }

      const archetype = json.data;

      expect(res.status).toBe(200);
      expect(archetype?.name).toBe(_createdArchetype.name);
    });
  });

  describe("update", () => {
    // --------------------------
    // UPDATE ARCHETYPE
    // --------------------------

    it("should not update archetype, forbidden user", async () => {
      if (!_createdArchetype) {
        throw new Error("Archetype not created");
      }
      stub = await stubGetUserFromToken(_seed.normalUser);

      const body: ICreateArchetype = {
        name: _archetypeUpdatedName,
        slug: "as123123",
        description: "desc updated",
      };

      const res = await honoApp.request(
        `/api/archetypes/${_createdArchetype._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IArchetype> = await res.json();

      expect(res.status).toBe(403);
      expect(json.error).toBeTruthy();
    });

    it("should update archetype info", async () => {
      if (!_createdArchetype) {
        throw new Error("Archetype not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const body: ICreateArchetype = {
        name: _archetypeUpdatedName,
        slug: "as123123",
        description: "desc updated",
      };

      const res = await honoApp.request(
        `/api/archetypes/${_createdArchetype._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IArchetype> = await res.json();

      expect(res.status).toBe(200);
      expect(json.error).toBeFalsy();
      expect(json.data?.name).toBe(body.name);
    });
  });

  describe("delete", () => {
    it("should delete archetype", async () => {
      if (!_createdArchetype) {
        throw new Error("Archetype not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const res = await honoApp.request(
        `/api/archetypes/${_createdArchetype._id}`,
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
