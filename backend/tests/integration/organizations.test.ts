import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IListRouteInput } from "../../src/@schemas/listRoute";
import { PaginationResult } from "../../src/@schemas/pagination";
import { addToQuery } from "../../src/helpers/addToQuery";
import { Organization } from "../../src/routes/organizations/schemas/organization";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { SeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";

describe("organizations integration suite", () => {
  let _seed: SeedResult;

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

  // test("prevent", () => {
  //   expect(true).toBeTruthy();
  // });

  describe.skip("list", () => {
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

      if (json.error) {
        console.log("list error", json.error);
      }

      console.log("list", json);

      expect(res.status).toBe(200);
      expect(json.data?.list.length).toBe(2);
    });
  });
});
