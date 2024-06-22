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
      role: "user",
      organizationId: "123123",
    };
    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json: AppResponse<User> = await res.json();

    // console.log('res', res)
    console.log('json', json)

    if(json.error){
      console.log('', json.error)
    }

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

    const user = json.data;

    expect(res.status).toBe(200);
    expect(user?.name).toBe(_createdUser.name);
    expect(user?.uid).toBe(_createdUser.uid);
    expect(user?._id).toBe(_createdUser._id);
    expect(user?.organizationId).toBeTruthy();
  });
});
