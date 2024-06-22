import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import {
  Organization,
  OrganizationModel,
} from "../../src/routes/organizations/schemas/organization";
import { User, CreateUser } from "../../src/routes/users/schemas/user";
import { TestServer } from "../mongodb-memory-server";

describe("users and organizations integration suite", () => {
  let _createdUser: User | null = null;
  let _organization: Organization | null = null;
  let _orgName = "Organization 2";
  let _userName = "Xucrute 2";

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

  it("should list empty users", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toStrictEqual([]);
  });

  it("should create a new user", async () => {
    if (!_organization) {
      throw new Error("Organization was not created");
    }

    const body: CreateUser = {
      active: true,
      name: _userName,
      firebaseId: Date.now().toString(),
      role: "user",
      organization: _organization._id,
    };
    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json: AppResponse<User> = await res.json();

    const user = json.data;

    expect(res.status).toBe(200);
    expect(json.error).toBe(null);
    expect(user?.name).toBe(body.name);
    expect(user?._id).toBeTruthy();
    expect(user?.firebaseId).toBeTruthy();

    //   const validation = zUser.safeParse(user);
    //   expect(validation.success).toBe(true);

    _createdUser = user;
  });
  it("should list one user", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toHaveLength(1);
  });
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
});
