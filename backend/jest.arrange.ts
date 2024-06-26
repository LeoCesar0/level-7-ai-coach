import Sinon from "sinon";
import { firebaseAuth } from "./src/lib/firebase";
import { honoServer } from "./src";

beforeAll(async () => {
  console.log("🧪 Starting tests!");
});

afterAll(async () => {
  // Your cleanup or finalization code here
  console.log("🧼 Cleaning up tests!");

  globalThis.TEST_GLOBALS.createdUsers.forEach((user) => {
    // console.log("❌ Deleting test user", user);
  });
  const ids = globalThis.TEST_GLOBALS.createdUsers.map(
    (item) => item.firebaseId
  );
  if (ids.length) {
    await firebaseAuth.deleteUsers(ids);
  }

  globalThis.TEST_GLOBALS.createdUsers = [];

  Sinon.restore();
  honoServer.close();
});
