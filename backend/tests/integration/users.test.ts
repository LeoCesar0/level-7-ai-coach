import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IPaginationResult } from "../../src/@schemas/pagination";
import { slugify } from "../../src/helpers/slugify";
import {
  IOrganization,
  OrganizationModel,
} from "../../src/routes/organizations/schemas/organization";
import { ICreateUser } from "../../src/routes/users/schemas/createUser";
import { ISignUpRoute } from "../../src/routes/users/schemas/signUpRoute";
import { IUpdateUserRoute } from "../../src/routes/users/schemas/updateUserRoute";
import { IUser, UserModel } from "../../src/routes/users/schemas/user";
import { EXCEPTIONS } from "../../src/static/exceptions";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";

describe("users and organizations integration suite", () => {
  let _organization: IOrganization;

  let _createdUser: IUser | null = null;
  let _userName = "Xucrute " + Date.now();
  let _userEmail = slugify(_userName) + "@test.com";

  let _seed: ISeedResult;

  let stub: sinon.SinonStub<any>;

  beforeAll(async () => {
    await TestServer.connectTestServer();
    _seed = (await TestServer.seedTestServer())!;

    _organization = _seed.organization1;
  });

  afterAll(async () => {
    await TestServer.disconnectTestServer();
  });

  afterEach(() => {
    if (stub) {
      stub.restore();
    }
  });

  // --------------------------
  // CREATE NEW USER
  // --------------------------
  it("should create a new user, by admin", async () => {
    if (!_organization) {
      throw new Error("Organization was not created");
    }
    // --------------------------
    // ARRANGE
    // --------------------------

    stub = await stubGetUserFromToken(_seed.admin);

    const userOnCreate: ICreateUser = {
      active: true,
      name: _userName,
      role: "user",
      organization: _organization._id,
      email: _userEmail,
    };
    const body: ISignUpRoute = {
      password: "123456789",
      user: userOnCreate,
    };

    // --------------------------
    // ACT
    // --------------------------

    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
    });

    const json: AppResponse<IUser> = await res.json();

    const user = json.data;

    if (json.error) {
      console.log("❌ Create error", json.error);
    }

    // --------------------------
    // ASSERT
    // --------------------------

    expect(res.status).toBe(200);
    expect(json.error).toBe(null);
    expect(user?.name).toBe(userOnCreate.name);
    expect(user?._id).toBeTruthy();
    expect(user?.firebaseId).toBeTruthy();

    _createdUser = user;
  });
  // --------------------------
  // LIST USER
  // --------------------------
  it("should list and find created user", async () => {
    stub = await stubGetUserFromToken(_seed.admin);

    const res = await honoApp.request("/api/users/list", {
      method: "POST",
      body: JSON.stringify({}),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 123",
      },
    });

    const json: AppResponse<IPaginationResult<IUser>> = await res.json();

    const found = json.data?.list.find(
      (item) => item._id === _createdUser?._id
    );

    expect(res.status).toBe(200);
    expect(found).toBeTruthy();
  });
  // --------------------------
  // GET USER
  // --------------------------
  it("should get the created user", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }

    const res = await honoApp.request(`/api/users/${_createdUser._id}`);

    const json: AppResponse<IUser> = await res.json();

    const user = json.data;

    expect(res.status).toBe(200);
    expect(user?.name).toBe(_createdUser.name);
    expect(user?.firebaseId).toBe(_createdUser.firebaseId);
    expect(user?._id).toBe(_createdUser._id);
    expect(user?.organization).toBeTruthy();
  });
  // --------------------------
  // VERIFY SET ORGANIZATION
  // --------------------------
  it("should set created user to the created organization", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }
    if (!_organization) {
      throw new Error("Organization not created");
    }
    const updatedOrgRes = await OrganizationModel.findById(_organization?._id);

    const updatedOrg = updatedOrgRes?.toObject();

    const found = updatedOrg?.users.find(
      (id) => id.toString() === _createdUser?._id
    );
    expect(found).toBeTruthy();
  });
  // --------------------------
  // DENY CREATE SAME USER
  // --------------------------
  it("should not create user with same email, user exists", async () => {
    if (!_createdUser) {
      throw new Error("User not created");
    }

    stub = await stubGetUserFromToken(_seed.admin);

    const userOnCreate: ICreateUser = {
      active: true,
      name: _userName,
      role: "user",
      organization: _organization!._id,
      email: _createdUser.email,
    };
    const body: ISignUpRoute = {
      password: "123456789",
      user: userOnCreate,
    };

    const res = await honoApp.request("/api/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer any-token",
      },
    });

    const json: AppResponse<IUser> = await res.json();

    expect(res.status).toBe(400);
    expect(json.error?.message).toBe(EXCEPTIONS.USER_ALREADY_EXISTS);
  });
  // --------------------------
  // UPDATE USER
  // --------------------------
  describe("update", () => {
    let _updatedUser: IUser | null = null;
    it("should not update user info, not the same user", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      if (!_seed.normalUser) {
        throw new Error("Normal User not created");
      }
      stub = await stubGetUserFromToken(_seed.normalUser);

      const body: IUpdateUserRoute = {
        info: {
          birthday: "1995-05-04",
          athleteAsMain: true,
          currentInjury: "Leg hurts",
          nick: "Jonny",
          gender: "Male",
          q_mind_1: "I don't practice dosha, but i am interested",
          pastInjury: "Broken leg",
          mainWorkoutDescription: "Soccer player",
          mainWorkoutDuration: "4 hours",
          mainWorkoutInterval: "5 days of the week",
          mainJob: "Soccer player",
          shortTermGoals: "Become the main goalkeeper in the team",
          longTermGoals: "Win a gold metal",
          hobbyDescription: "Play video game with my son",
          hobbyInterval: "Weekends",
          hobbyDuration: "All day",
          medicines: "alprazolam",
          meditationPreference: "I am interested",
          currentDietPlan: "Lowcarbs",
        },
      };

      const res = await honoApp.request(
        `/api/users/${_createdUser._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IUser> = await res.json();

      expect(res.status).toBe(401);
      expect(json.error?.message).toBe(EXCEPTIONS.NOT_AUTHORIZED);
    });

    it("should update user athlete info and name", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      stub = await stubGetUserFromToken(_createdUser);

      const body: IUpdateUserRoute = {
        info: {
          birthday: "1995-05-04",
          athleteAsMain: true,
          currentInjury: "Leg hurts",
          nick: "Jonny",
          gender: "Male",
          q_mind_1: "I don't practice dosha, but i am interested",
          pastInjury: "Broken leg",
          mainWorkoutDescription: "Soccer player",
          mainWorkoutDuration: "4 hours",
          mainWorkoutInterval: "5 days of the week",
          mainJob: "Soccer player",
          shortTermGoals: "Become the main goalkeeper in the team",
          longTermGoals: "Win a gold metal",
          hobbyDescription: "Play video game with my son",
          hobbyInterval: "Weekends",
          hobbyDuration: "All day",
          medicines: "alprazolam",
          meditationPreference: "I am interested",
          currentDietPlan: "Lowcarbs",
        },
        name: "Jonny 123",
      };

      const res = await honoApp.request(
        `/api/users/${_createdUser._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IUser> = await res.json();

      const user = json.data;

      _updatedUser = user;

      expect(res.status).toBe(200);
      expect(user?._id).toBe(_createdUser._id.toString());
      expect(user?.info).toBeTruthy();
      expect(user?.info?.birthday).toBe(body.info?.birthday);
      expect(user?.info?.currentInjury).toBe(body.info?.currentInjury);
      expect(user?.info?.q_mind_1).toBe(body.info?.q_mind_1);
      expect(user?.info?.disabilities.length).toBeFalsy();
      expect(user?.name).toBe(body.name);
      expect(user?.email).toBeTruthy();
      expect(user?.phone).toBeFalsy();
    });
    it("should update user email, updated by admin", async () => {
      if (!_updatedUser) {
        throw new Error("User not updated 1st time");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const body: IUpdateUserRoute = {
        phone: "12345678915",
      };

      const res = await honoApp.request(
        `/api/users/${_updatedUser._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IUser> = await res.json();

      const user = json.data;

      expect(res.status).toBe(200);
      expect(user?.phone).toBe(body.phone);
      expect(user?._id).toBe(_updatedUser._id.toString());
      expect(user?.info).toBeTruthy();
      expect(user?.info?.birthday).toBe(_updatedUser.info?.birthday);
      expect(user?.name).toBe(_updatedUser.name);
    });
  });

  describe("delete", () => {
    it("should delete user", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const found0 = await UserModel.findById(_createdUser._id);
      expect(found0).toBeTruthy();
      const foundOrg0 = await OrganizationModel.findOne({
        users: { $in: [_createdUser._id] },
      });
      expect(foundOrg0).toBeTruthy();

      const res = await honoApp.request(`/api/users/${_createdUser._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer any-token",
        },
      });

      const json: AppResponse<boolean> = await res.json();

      expect(res.status).toBe(200);
      expect(json.data).toBe(true);

      const found1 = await UserModel.findById(_createdUser._id);
      expect(found1).toBeFalsy();
      const foundOrg1 = await OrganizationModel.findOne({
        users: { $in: [_createdUser._id] },
      });
      expect(foundOrg1).toBeFalsy();
    });
  });
});
