import honoApp from "../../src";
import { AppResponse } from "../../src/@schemas/app";
import { IPaginationResult } from "../../src/@schemas/pagination";
import { slugify } from "../../src/helpers/slugify";
import {
  ASSESSMENT_QUESTION,
  zAssessmentSection,
} from "../../src/routes/assessment/schemas/enums";
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

  describe("create", () => {
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
        console.log("❌ Create user error", json.error);
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
    // VERIFY SET ORGANIZATION
    // --------------------------
    it("should set created user to the created organization", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      if (!_organization) {
        throw new Error("Organization not created");
      }
      const updatedOrgRes = await OrganizationModel.findById(
        _organization?._id
      );

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
      expect(json.error?.message).toBe(
        EXCEPTIONS.USER_EMAIL_ALREADY_REGISTERED
      );
    });
  });

  describe("list", () => {
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
  });

  describe("get", () => {
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
  });

  describe("update", () => {
    // --------------------------
    // UPDATE USER
    // --------------------------
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
        athleteInfo: {
          effort_goals: {
            answer: "Become the best!",
            question: ASSESSMENT_QUESTION["effort_goals"],
            section: zAssessmentSection.enum.effort,
          },
          goals_goalsAchieved: {
            answer: "Win a gold medal",
            question: ASSESSMENT_QUESTION["goals_goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
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
        name: "updated name",
        birthday: new Date("1990-01-01").toISOString(),
        athleteInfo: {
          effort_goals: {
            answer: "Become the best!",
            question: ASSESSMENT_QUESTION["effort_goals"],
            section: zAssessmentSection.enum.effort,
          },
          goals_goalsAchieved: {
            answer: "Win a gold medal",
            question: ASSESSMENT_QUESTION["goals_goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
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

      const user = json.data;

      _updatedUser = user;

      expect(res.status).toBe(200);
      expect(user?._id).toBe(_createdUser._id.toString());
      expect(user?.athleteInfo).toBeTruthy();
      expect(user?.birthday).toBeTruthy();
      expect(user?.birthday).toBe(body.birthday);

      expect(user?.athleteInfo).toEqual(body.athleteInfo);
      expect(user?.name).toBe(body.name);
      expect(user?.email).toBeTruthy();
      expect(user?.phone).toBeFalsy();
    });

    it("should update user phone, and athlete info, updated by admin", async () => {
      if (!_updatedUser) {
        throw new Error("User not updated 1st time");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const newAnswer = "Win a Silver medal (CHANGED)";

      const body: IUpdateUserRoute = {
        phone: "12345678915",
        athleteInfo: {
          // effort_goals DID NOT TOUCH
          goals_goalsAchieved: {
            // UPDATED
            answer: newAnswer,
            question: ASSESSMENT_QUESTION["goals_goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
          physical_injuriesAndHealthIssues: {
            // ADDED
            answer: "None",
            question: ASSESSMENT_QUESTION["physical_injuriesAndHealthIssues"],
            section: zAssessmentSection.enum.physical,
          },
        },
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
      expect(user?.name).toBe(_updatedUser.name);
      expect(user?.athleteInfo).toBeTruthy();

      // UPDATED
      expect(user?.athleteInfo?.goals_goalsAchieved?.answer).toBe(newAnswer);

      // ADDED
      expect(user?.athleteInfo?.physical_injuriesAndHealthIssues).toEqual(
        body.athleteInfo?.physical_injuriesAndHealthIssues
      );

      // DID NOT TOUCH
      expect(user?.athleteInfo?.effort_goals).toEqual(
        _updatedUser.athleteInfo?.effort_goals
      );
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
