import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { slugify } from "../../src/helpers/slugify";
import {
  Organization,
  OrganizationModel,
} from "../../src/routes/organizations/schemas/organization";
import { User, CreateUser, SignUp } from "../../src/routes/users/schemas/user";
import * as getUserFromTokenFile from "../../src/services/getUserFromToken";
import { EXCEPTIONS } from "../../src/static/exceptions";
import { SeedResult, TestServer } from "../mongodb-memory-server";
import { jest } from "@jest/globals";
import sinon from "sinon";

describe("users and organizations integration suite", () => {
  let _organization: Organization;

  let _createdUser: User | null = null;
  let _userName = "Xucrute " + Date.now();
  let _userEmail = slugify(_userName) + "@test.com";

  let _seed: SeedResult;

  let stub: sinon.SinonStub<any>;

  const stubGetUserFromToken = async (resolves: User) => {
    const module = (await import("../../src/services/getUserFromToken"))
      .getUserFromToken;
    stub = sinon.stub(module, "exec");
    stub.resolves(resolves);
  };

  beforeAll(async () => {
    await TestServer.connectTestServer();
    _seed = (await TestServer.seedTestServer())!;

    _organization = _seed.organization1;
  });

  afterAll(async () => {
    await TestServer.disconnectTestServer();
    stub.restore();
  });

  afterEach(() => {
    if (stub) {
      stub.restore();
    }
  });

  // --------------------------
  // CREATE NEW USER
  // --------------------------
  it("should create a new user, by admin", async () => {
    if (!_organization) {
      throw new Error("Organization was not created");
    }
    // --------------------------
    // ARRANGE
    // --------------------------

    stubGetUserFromToken(_seed.admin);

    const userOnCreate: CreateUser = {
      active: true,
      name: _userName,
      role: "user",
      organization: _organization._id,
      email: _userEmail,
    };
    const body: SignUp = {
      password: "123456789",
      user: userOnCreate,
    };

    // --------------------------
    // ACT
    // --------------------------

    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
    });

    const json: AppResponse<User> = await res.json();

    const user = json.data;

    if (json.error) {
      console.log("Create error", json.error);
    }

    // --------------------------
    // ASSERT
    // --------------------------

    expect(res.status).toBe(200);
    expect(json.error).toBe(null);
    expect(user?.name).toBe(userOnCreate.name);
    expect(user?._id).toBeTruthy();
    expect(user?.firebaseId).toBeTruthy();

    _createdUser = user;
  });
  // --------------------------
  // LIST USER
  // --------------------------
  it("should list and find created user", async () => {
    stubGetUserFromToken(_seed.admin);

    const res = await honoApp.request("/api/users");

    const json: AppResponse<User[]> = await res.json();

    const found = json.data?.find((item) => item._id === _createdUser?._id);

    expect(res.status).toBe(200);
    expect(found).toBeTruthy();
  });
  // --------------------------
  // GET USER
  // --------------------------
  it("should get the created user", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }

    const res = await honoApp.request(`/api/users/${_createdUser._id}`);

    const json: AppResponse<User> = await res.json();

    const user = json.data;

    expect(res.status).toBe(200);
    expect(user?.name).toBe(_createdUser.name);
    expect(user?.firebaseId).toBe(_createdUser.firebaseId);
    expect(user?._id).toBe(_createdUser._id);
    expect(user?.organization).toBeTruthy();
  });
  // --------------------------
  // VERIFY SET ORGANIZATION
  // --------------------------
  it("should set created user to the created organization", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }
    if (!_organization) {
      throw new Error("Organization not created");
    }
    const updatedOrgRes = await OrganizationModel.findById(_organization?._id);

    const updatedOrg = updatedOrgRes?.toObject();

    const found = updatedOrg?.users.find(
      (id) => id.toString() === _createdUser?._id
    );
    expect(found).toBeTruthy();
  });
  // --------------------------
  // DENY CREATE SAME USER
  // --------------------------
  it("should not create user with same email, user exists", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }

    stubGetUserFromToken(_seed.admin);

    const userOnCreate: CreateUser = {
      active: true,
      name: _userName,
      role: "user",
      organization: _organization!._id,
      email: _createdUser.email,
    };
    const body: SignUp = {
      password: "123456789",
      user: userOnCreate,
    };

    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer any-token",
      },
    });

    const json: AppResponse<User> = await res.json();

    expect(res.status).toBe(400);
    expect(json.error?.message).toBe(EXCEPTIONS.USER_ALREADY_EXISTS);
  });
});
