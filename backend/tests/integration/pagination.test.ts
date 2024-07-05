import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IPaginationBody } from "../../src/@schemas/listRoute";
import { IPaginationResult } from "../../src/@schemas/pagination";
import { ICreateOrganization } from "../../src/routes/organizations/schemas/createOrganization";
import {
  IOrganization,
  OrganizationModel,
} from "../../src/routes/organizations/schemas/organization";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";

describe("pagination integration suite", () => {
  console.log("🔻 Enter PAGINATION integration suite  -->");
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

  const _findDisabled = async () => {
    const createOrgs: ICreateOrganization = {
      name: `Org disabled`,
    };

    await OrganizationModel.create({
      ...createOrgs,
      active: false,
    });

    const body: IPaginationBody = {
      limit: 100,
      page: 1,
    };

    // --------------------------
    // ACT
    // --------------------------

    const res = await honoApp.request("/api/organizations/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
      body: JSON.stringify(body),
    });

    const json: AppResponse<IPaginationResult<IOrganization>> =
      await res.json();

    if (json.error) {
      console.log("❌ json.error", json.error);
    }

    return { json, createOrgs, res };
  };

  it("should list 2 organizations", async () => {
    const prevNOrganizations = (await OrganizationModel.find()).length;

    stub = await stubGetUserFromToken(_seed.admin);

    const body: IPaginationBody = {
      limit: 10,
      page: 1,
    };

    const res = await honoApp.request("/api/organizations/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
      body: JSON.stringify(body),
    });

    const json: AppResponse<IPaginationResult<IOrganization>> =
      await res.json();

    if (json.error) {
      console.log("❌ json.error", json.error);
    }

    const list = json.data?.list ?? [];

    expect(res.status).toBe(200);
    expect(list.length).toBe(prevNOrganizations);
    expect(json.data?.page).toBe(1);
    expect(json.data?.nextPage).toBe(null);
    expect(json.data?.prevPage).toBe(null);
    expect(list[0]._id.toString()).toBe(_seed.organization1._id.toString());
    expect(list[1]._id.toString()).toBe(
      _seed.organizationMaster._id.toString()
    );
  });
  it("should list 4 of 10 organizations", async () => {
    // --------------------------
    // ARRANGE
    // --------------------------
    const prevNOrganizations = (await OrganizationModel.find()).length;

    const nItems = Array.from({ length: 10 - prevNOrganizations }).fill(0);

    const createOrgs: ICreateOrganization[] = nItems.map((_, index) => {
      return {
        name: `Org ${index}`,
      };
    });

    for (const org of createOrgs) {
      await OrganizationModel.create({
        ...org,
      });
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve(undefined);
        }, 100);
      });
    }

    stub = await stubGetUserFromToken(_seed.admin);

    const body: IPaginationBody = {
      limit: 4,
      page: 2,
      sortBy: "createdAt",
      sortOrder: "desc",
    };

    // --------------------------
    // ACT
    // --------------------------

    const res = await honoApp.request("/api/organizations/list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
      body: JSON.stringify(body),
    });

    const json: AppResponse<IPaginationResult<IOrganization>> =
      await res.json();

    if (json.error) {
      console.log("❌ json.error", json.error);
    }

    const data = json.data;
    const list = json.data?.list ?? [];

    // --------------------------
    // ASSERT
    // --------------------------

    expect(res.status).toBe(200);
    expect(list.length).toBe(Number(body.limit));
    expect(data?.page).toBe(Number(body.page));
    expect(data?.nextPage).toBe(Number(body.page) + 1);
    expect(data?.prevPage).toBe(Number(body.page) - 1);
    expect(data?.totalItems).toBe(10);
    expect(data?.hasNextPage).toBe(true);
    expect(data?.hasPrevPage).toBe(true);

    const getNum = (name: string) => Number(name.split(" ")[1]);

    expect(getNum(list[0].name)).toBe(3);
    expect(getNum(list[1].name)).toBe(2);
    expect(getNum(list[2].name)).toBe(1);
    expect(getNum(list[3].name)).toBe(0);
  });
  it("should not list disabled organization, if user request", async () => {
    // --------------------------
    // ARRANGE
    // --------------------------
    stub = await stubGetUserFromToken(_seed.normalUser);

    const { json, createOrgs, res } = await _findDisabled();

    const list = json.data?.list ?? [];

    // --------------------------
    // ASSERT
    // --------------------------

    const foundDisabled = list.find((item) => item.name === createOrgs.name);

    expect(res.status).toBe(200);
    expect(foundDisabled).toBeFalsy();
  });
  it("should not list disabled organization, if user request", async () => {
    // --------------------------
    // ARRANGE
    // --------------------------
    stub = await stubGetUserFromToken(_seed.admin);

    const { json, createOrgs, res } = await _findDisabled();

    const list = json.data?.list ?? [];

    // --------------------------
    // ASSERT
    // --------------------------

    const foundDisabled = list.find((item) => item.name === createOrgs.name);

    expect(res.status).toBe(200);
    expect(foundDisabled).toBeTruthy();
  });
});
