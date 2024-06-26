import { addToQuery } from "../../src/helpers/addToQuery";

describe("addToQuery", () => {
  it("should add query to url", () => {
    const url = "http://localhost:3000";
    const obj = {
      limit: 10,
      page: 1,
    };
    const result = addToQuery({ url, obj });
    expect(result).toBe("http://localhost:3000?limit=10&page=1");
  });
});
