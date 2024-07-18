import { AppResponse } from "@common/schemas/app";
import honoApp from "../../src";
import { slugify } from "../../src/helpers/slugify";
import { ICreateOrganization } from "../../src/routes/organizations/schemas/createOrganization";
import {
  IOrganization,
  OrganizationModel,
  zOrganization,
} from "../../src/routes/organizations/schemas/organization";
import { UserModel } from "../../src/routes/users/schemas/user";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";

describe("organizations integration suite", () => {
  console.log("🔻 Enter ORGANIZATIONS integration suite  -->");
  let _seed: ISeedResult;

  let stub: sinon.SinonStub<any>;

  let _createdOrg: IOrganization | null = null;

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
    it("should create an organization, by admin", async () => {
      // --------------------------
      // ARRANGE
      // --------------------------

      stub = await stubGetUserFromToken(_seed.admin);

      const body: ICreateOrganization = {
        name: "Organization test - " + Date.now(),
      };

      // --------------------------
      // ACT
      // --------------------------

      const res = await honoApp.request("/api/organizations", {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IOrganization> = await res.json();

      const org = json.data;

      if (json.error) {
        console.log("❌ Create error", json.error);
      }

      // --------------------------
      // ASSERT
      // --------------------------

      expect(res.status).toBe(200);
      expect(json.error).toBe(null);
      expect(org?._id).toBeTruthy();
      expect(org?.active).toBe(true);
      expect(org?.slug).toBe(slugify(body.name));

      const correctType = zOrganization.safeParse(org);
      expect(correctType.success).toBe(true);

      _createdOrg = org;
    });
  });

  describe("get", () => {
    it("should NOT get organization by id, normal user should not access", async () => {
      if (!_createdOrg) {
        throw new Error("Organization not created");
      }
      stub = await stubGetUserFromToken(_seed.normalUser);

      // --------------------------
      // ACT
      // --------------------------

      const res = await honoApp.request(
        "/api/organizations/" + _createdOrg._id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 123",
          },
        }
      );

      const json: AppResponse<IOrganization> = await res.json();

      const org = json.data;

      // --------------------------
      // ASSERT
      // --------------------------

      expect(res.status).toBe(403);
      expect(org).toBeFalsy();
    });
    it("should get organization by id", async () => {
      if (!_createdOrg) {
        throw new Error("Organization not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      // --------------------------
      // ACT
      // --------------------------

      const res = await honoApp.request(
        "/api/organizations/" + _createdOrg._id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 123",
          },
        }
      );

      const json: AppResponse<IOrganization> = await res.json();

      const org = json.data;

      if (json.error) {
        console.log("❌ Get error", json.error);
      }

      // --------------------------
      // ASSERT
      // --------------------------

      expect(res.status).toBe(200);
      expect(org).toBeTruthy();
      expect(org?.name).toBe(_createdOrg.name);
    });
  });

  describe("update", () => {
    it("should update org", async () => {
      if (!_createdOrg) {
        throw new Error("Organization not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const body: Partial<IOrganization> = {
        name: "New org name " + Date.now(),
      };

      // --------------------------
      // ACT
      // --------------------------

      const res = await honoApp.request(
        "/api/organizations/" + _createdOrg._id,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer 123",
          },
        }
      );

      const json: AppResponse<IOrganization> = await res.json();

      const org = json.data;

      if (json.error) {
        console.log("❌ Update error", json.error);
      }

      // --------------------------
      // ASSERT
      // --------------------------

      expect(res.status).toBe(200);
      expect(json.error).toBe(null);
      expect(org?._id).toBeTruthy();
      expect(org?.name).toBe(body.name);
      expect(org?.slug).toBe(slugify(body.name!));

      const correctType = zOrganization.safeParse(org);
      expect(correctType.success).toBe(true);
    });
  });
  describe("delete", () => {
    it("should NOT delete organization admin", async () => {
      stub = await stubGetUserFromToken(_seed.admin);

      const res = await honoApp.request(
        "/api/organizations/" + _seed.organizationMaster._id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer 123",
          },
        }
      );

      const json: AppResponse<boolean> = await res.json();

      expect(res.status).toBe(403);
      expect(json.error).toBeTruthy();
      expect(json.data).toBeFalsy();
    });

    it("should correctly delete organization and its users", async () => {
      if (!_createdOrg) {
        throw new Error("Organization not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);
      await OrganizationModel.updateOne(
        {
          _id: _createdOrg._id,
        },
        {
          users: [_seed.normalUser._id],
        }
      );
      await UserModel.updateOne(
        {
          _id: _seed.normalUser._id,
        },
        {
          organization: _createdOrg._id,
        }
      );
      const usersOfOrg = await UserModel.find({
        organization: _createdOrg._id,
      });
      expect(
        usersOfOrg.find((user) => user.id === _seed.normalUser._id.toString())
      ).toBeTruthy();

      const res = await honoApp.request(
        "/api/organizations/" + _createdOrg._id,
        {
          method: "DELETE",
          headers: {
            Authorization: "Bearer 123",
          },
        }
      );

      const json: AppResponse<boolean> = await res.json();

      expect(res.status).toBe(200);
      expect(json.error).toBe(null);
      expect(json.data).toBe(true);

      const usersOfOrgAfter = await UserModel.find({
        organization: _createdOrg._id,
      });
      expect(
        usersOfOrgAfter.find(
          (user) => user.id === _seed.normalUser._id.toString()
        )
      ).toBeFalsy();
      const userFinal = await UserModel.findById(_seed.normalUser._id);
      expect(userFinal).toBeFalsy();
    });
  });
});
