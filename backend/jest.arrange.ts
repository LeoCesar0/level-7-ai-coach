import { firebaseAuth } from "./src/lib/firebase";

beforeAll(async () => {});

afterAll(async () => {
  // Your cleanup or finalization code here
  console.log("Running after test setup!");

  globalThis.TEST_GLOBALS.createdUsers.forEach((user) => {
    console.log("Deleting test user", user);
  });
  const ids = globalThis.TEST_GLOBALS.createdUsers.map(
    (item) => item.firebaseId
  );
  if (ids.length) {
    await firebaseAuth.deleteUsers(ids);
  }

  globalThis.TEST_GLOBALS.createdUsers = [];
});
