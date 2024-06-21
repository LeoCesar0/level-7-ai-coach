// import honoApp from "../../src/index";
import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { User, UserRaw, zUser } from "../../src/routes/users/schemas/user";
import { TestServer } from "../mongodb-memory-server";

describe("users integration suite", () => {
  let _createdUser: User | null = null;

  beforeAll(async () => {
    await TestServer.connectTestServer();
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
    const body: UserRaw = {
      active: true,
      name: "Maria da Silva",
      uid: Date.now().toString(),
    };
    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json: AppResponse<User> = await res.json();

    expect(res.status).toBe(200);
    expect(json.error).toBe(null);
    expect(json.data?.name).toBe(body.name);

    const validation = zUser.safeParse(json.data);
    expect(validation.success).toBe(true);
    _createdUser = json.data;
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

    expect(res.status).toBe(200);
    expect(json.data?.name).toBe(_createdUser.name);
    expect(json.data?.uid).toBe(_createdUser.uid);
    expect(json.data?._id).toBe(_createdUser._id);
  });
});
