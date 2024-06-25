import { firebaseAuth } from "./src/lib/firebase";

beforeAll(async () => {});

afterAll(async () => {
  // Your cleanup or finalization code here
  console.log("All tests are done!");

  globalThis.TEST_CONFIG.createdUsers.forEach((user) => {
    console.log("Deleting test user", user);
  });
  const ids = globalThis.TEST_CONFIG.createdUsers.map(
    (item) => item.firebaseId
  );
  if (ids.length) {
    await firebaseAuth.deleteUsers(ids);
  }

  globalThis.TEST_CONFIG.createdUsers = [];
});
