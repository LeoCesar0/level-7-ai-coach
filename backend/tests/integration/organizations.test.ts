import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IListRouteInput } from "../../src/@schemas/listRoute";
import { PaginationResult } from "../../src/@schemas/pagination";
import { addToQuery } from "../../src/helpers/addToQuery";
import { CreateOrganization } from "../../src/routes/organizations/schemas/createOrganization";
import {
  Organization,
  zOrganization,
} from "../../src/routes/organizations/schemas/organization";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { SeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";

describe("organizations integration suite", () => {
  let _seed: SeedResult;

  let stub: sinon.SinonStub<any>;

  let _createdOrg: Organization | null = null;

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

  describe("list", () => {
    it("should list 2 organizations", async () => {
      stub = await stubGetUserFromToken(_seed.admin);

      const body: IListRouteInput = {
        limit: "10",
        page: "1",
      };

      const url = addToQuery({
        url: "/api/organizations",
        obj: body,
      });

      const res = await honoApp.request(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<PaginationResult<Organization>> =
        await res.json();

      expect(res.status).toBe(200);
      expect(json.data?.list.length).toBe(2);
    });
  });
  describe("create", () => {
    it("should create an organization, by admin", async () => {
      // --------------------------
      // ARRANGE
      // --------------------------

      stub = await stubGetUserFromToken(_seed.admin);

      const body: CreateOrganization = {
        name: "Organization test - " + Date.now(),
        users: [],
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

      const json: AppResponse<Organization> = await res.json();

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

      const correctType = zOrganization.safeParse(org);
      expect(correctType.success).toBe(true);

      _createdOrg = org;
    });
  });
});
