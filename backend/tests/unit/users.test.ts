import honoApp from "../../src/index";

// import { sum } from "../../src/sum";

describe("users suite", () => {
  it("should list empty users", async () => {
    const res = await honoApp.request("/api/users");

    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data).toStrictEqual([]);

    // expect(sum(1)).toBe(2);
  });
});
