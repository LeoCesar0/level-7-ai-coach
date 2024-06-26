// import { Context } from "hono";
// import { IUser } from "./src/routes/users/schemas/user";

// interface ExtendedContext extends Context {
//   reqUser?: IUser | null | undefined;
// }

// declare module "hono" {
//   interface Context {
//     reqUser?: ExtendedContext["reqUser"];
//   }
// }

// // --------------------------

type User = {
  firebaseId: string;
  name: string;
  email: string;
};

type TestGlobalConfig = {
  createdUsers: User[];
};

declare global {
  var TEST_GLOBALS: TestGlobalConfig;
}

export {};
