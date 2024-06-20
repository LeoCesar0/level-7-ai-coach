// import honoApp from "../../src/index";
import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { User, UserRaw } from "../../src/routes/users/schemas/user";

describe("users integration suite", () => {
  it("should list empty users", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    console.log('LISt json', json)

    expect(res.status).toBe(200);
    expect(json.data).toStrictEqual([]);
  });
  it("should create a new user", async () => {
    const body: UserRaw = {
      active: true,
      name: "Fulano",
    };
    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("res", res);
    console.log("res.body", res.body);
    console.log("res.statusText", res.statusText);
    console.log("res.status", res.status);
    // console.log("res.formdataData", (await res.formData()).getAll("data"));

    const json: AppResponse<User> = await res.json();

    console.log("json", json);

    expect(res.status).toBe(200);
    expect(json.error).toBe(null);
    expect(json.data?.name).toBe("Fulano");
  });
});
