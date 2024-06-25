import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { slugify } from "../../src/helpers/slugify";
import {
  Organization,
  OrganizationModel,
} from "../../src/routes/organizations/schemas/organization";
import { User, CreateUser, SignUp } from "../../src/routes/users/schemas/user";
import { EXCEPTIONS } from "../../src/static/exceptions";
import { TestServer } from "../mongodb-memory-server";

describe("users and organizations integration suite", () => {
  let _createdUser: User | null = null;
  let _organization: Organization | null = null;
  let _orgName = "Organization 2";
  let _userName = "Xucrute " + Date.now();
  let _userEmail = slugify(_userName) + "@test.com";

  beforeAll(async () => {
    await TestServer.connectTestServer();
    const org = await OrganizationModel.create({
      name: _orgName,
    });
    _organization = org.toObject();
  });
  afterAll(async () => {
    await TestServer.disconnectTestServer();
  });

  // --------------------------
  // LIST EMPTY
  // --------------------------

  it("should list empty users", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toStrictEqual([]);
  });
  // --------------------------
  // CREATE NEW USER
  // --------------------------

  it("should create a new user", async () => {
    if (!_organization) {
      throw new Error("Organization was not created");
    }

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
  it("should list one user", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
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

    const updatedOrg = (
      await OrganizationModel.findById(_organization?._id)
    )?.toObject();

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
        Authorization: "Bearer 123",
      },
    });

    const json: AppResponse<User> = await res.json();

    expect(res.status).toBe(400);
    expect(json.error?.message).toBe(EXCEPTIONS.USER_ALREADY_EXISTS);
  });
});
