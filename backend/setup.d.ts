type User = {
  firebaseId: string;
  name: string;
  email: string;
};

type TestGlobalConfig = {
  createdUsers: User[];
};

declare global {
  var globalThis.TEST_GLOBALS: TestGlobalConfig;
}

export {};
