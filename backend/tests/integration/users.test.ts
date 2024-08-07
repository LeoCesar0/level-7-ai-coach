import { EXCEPTIONS } from "@common/static/exceptions";
import honoApp from "../../src";
import { IPaginationResult } from "@common/schemas/pagination";
import { slugify } from "../../src/helpers/slugify";
import { ArchetypeModel } from "../../src/routes/archetype/schemas/archetype";
import { OrganizationModel } from "../../src/routes/organizations/schemas/organization";
import { UserModel } from "../../src/routes/users/schemas/user";
import { stubGetUserFromToken } from "../helpers/stubGetUserFromToken";
import { ISeedResult, TestServer } from "../mongodb-memory-server";
import sinon from "sinon";
import { AppResponse } from "@common/schemas/app";
import { IOrganization } from "@common/schemas/organization/organization";
import { ICreateUser } from "@common/schemas/user/createUser";
import { ICreateUserRoute } from "@common/schemas/user/createUserRoute";
import { IUser, IUserFull } from "@common/schemas/user/user";
import { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import { zAssessmentSection } from "@common/schemas/assessment/enums";
import { ATHLETE_FORM_QUESTION } from "@common/schemas/user/athleteInfo";
import { parseToDate } from "@common/helpers/parseToDate";

describe("users integration suite", () => {
  console.log("🔻 Enter USERS integration suite  -->");
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
        name: _userName,
        role: "user",
        organization: _organization._id,
        email: _userEmail,
      };
      const body: ICreateUserRoute = {
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
        name: _userName,
        role: "user",
        organization: _organization!._id,
        email: _createdUser.email,
      };
      const body: ICreateUserRoute = {
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
    it("should paginate and find created user", async () => {
      stub = await stubGetUserFromToken(_seed.admin);

      const res = await honoApp.request("/api/users/paginate", {
        method: "POST",
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer 123",
        },
      });

      const json: AppResponse<IPaginationResult<IUserFull>> = await res.json();

      const found = json.data?.list.find(
        (item) => item._id === _createdUser?._id
      );

      expect(res.status).toBe(200);
      expect(found).toBeTruthy();
      expect(found?.organization.name).toBeTruthy();
    });
  });

  describe("get", () => {
    // --------------------------
    // GET USER
    // --------------------------
    it("should get the created user, by its team coach", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      stub = await stubGetUserFromToken(_seed.coachUser);

      const res = await honoApp.request(`/api/users/${_createdUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer any-token",
        },
      });

      const json: AppResponse<IUserFull> = await res.json();

      if (json.error) {
        console.log("❗ get user error -->", json.error);
      }

      const user = json.data;

      expect(res.status).toBe(200);
      expect(user?.name).toBe(_createdUser.name);
      expect(user?.firebaseId).toBe(_createdUser.firebaseId);
      expect(user?._id).toBe(_createdUser._id);
      expect(user?.organization).toBeTruthy();
      expect(user?.organization.name).toBeTruthy();
    });
    it("should get the created user, by admin", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const res = await honoApp.request(`/api/users/${_createdUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer any-token",
        },
      });

      const json: AppResponse<IUserFull> = await res.json();

      if (json.error) {
        console.log("❗ get user error -->", json.error);
      }

      const user = json.data;

      expect(res.status).toBe(200);
      expect(user?.name).toBe(_createdUser.name);
      expect(user?.firebaseId).toBe(_createdUser.firebaseId);
      expect(user?._id).toBe(_createdUser._id);
      expect(user?.organization).toBeTruthy();
      expect(user?.organization.name).toBeTruthy();
    });

    it("should NOT get the created user, by a common user", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      const userDoc = await UserModel.findById(_createdUser._id);
      stub = await stubGetUserFromToken(userDoc!);

      const res = await honoApp.request(`/api/users/${_createdUser._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer any-token",
        },
      });

      const json: AppResponse<IUserFull> = await res.json();

      const user = json.data;

      expect(res.status === 200).toBeFalsy();
      expect(user).toBeFalsy();
    });
  });

  describe("update", () => {
    // --------------------------
    // UPDATE USER
    // --------------------------
    let _updatedUser: IUser | null = null;

    it("should NOT update user info, by coach trying to update other team's user", async () => {
      if (!_seed.normalUser) {
        throw new Error("User not created");
      }

      stub = await stubGetUserFromToken(_seed.coachUser2);

      const body: IUpdateUser = {
        athleteInfo: {
          goals: {
            answer: "Become the best!",
            question: ATHLETE_FORM_QUESTION["goals"],
            section: zAssessmentSection.enum.effort,
          },
          goalsAchieved: {
            answer: "Win a gold medal",
            question: ATHLETE_FORM_QUESTION["goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
        },
      };

      const res = await honoApp.request(
        `/api/users/${_seed.normalUser._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IUserFull> = await res.json();

      expect(res.status).toBe(401);
      expect(json.error?.message).toBe(EXCEPTIONS.NOT_AUTHORIZED);
    });

    it("should update user info, by coach trying to update own team's user", async () => {
      if (!_seed.normalUser2) {
        throw new Error("User not created");
      }

      stub = await stubGetUserFromToken(_seed.coachUser2);

      const body: IUpdateUser = {
        athleteInfo: {
          goals: {
            answer: "Become the best!",
            question: ATHLETE_FORM_QUESTION["goals"],
            section: zAssessmentSection.enum.effort,
          },
          goalsAchieved: {
            answer: "Win a gold medal",
            question: ATHLETE_FORM_QUESTION["goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
        },
      };

      const res = await honoApp.request(
        `/api/users/${_seed.normalUser2._id.toString()}`,
        {
          method: "PUT",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer any-token",
          },
        }
      );

      const json: AppResponse<IUserFull> = await res.json();

      const user = json.data;

      expect(res.status).toBe(200);
      expect(user?._id).toBe(_seed.normalUser2._id.toString());
      expect(user?.athleteInfo).toBeTruthy();
    });

    it("should update user athlete info, name, birthDate and archetype, by admin", async () => {
      if (!_createdUser) {
        throw new Error("User not created");
      }
      stub = await stubGetUserFromToken(_seed.admin);
      const archetypeName = "A brand new Arch";
      const archetype = await ArchetypeModel.create({
        description: "desc",
        name: archetypeName,
        slug: "arch-name",
      });

      const body: IUpdateUser = {
        name: "updated name",
        birthDate: new Date("1990-01-01"),
        athleteInfo: {
          goals: {
            answer: "Become the best!",
            question: ATHLETE_FORM_QUESTION["goals"],
            section: zAssessmentSection.enum.effort,
          },
          goalsAchieved: {
            answer: "Win a gold medal",
            question: ATHLETE_FORM_QUESTION["goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
        },
        archetype: archetype._id.toString(),
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

      const json: AppResponse<IUserFull> = await res.json();

      const user = json.data;

      // @ts-ignore
      _updatedUser = user;

      expect(res.status).toBe(200);
      expect(user?._id).toBe(_createdUser._id.toString());
      expect(user?.athleteInfo).toBeTruthy();
      expect(user?.birthDate).toBeTruthy();
      expect(new Date(user!.birthDate!).toISOString()).toBe(
        new Date(body.birthDate!).toISOString()
      );

      expect(user?.athleteInfo).toEqual(body.athleteInfo);
      expect(user?.name).toBe(body.name);
      expect(user?.email).toBeTruthy();
      expect(user?.phone).toBeFalsy();
      expect(user?.organization.name).toBeTruthy();
      expect(user?.archetype.name).toBe(archetypeName);
    });

    it("should update user phone, and athlete info, updated by admin", async () => {
      if (!_updatedUser) {
        throw new Error("User not updated 1st time");
      }
      stub = await stubGetUserFromToken(_seed.admin);

      const newAnswer = "Win a Silver medal (CHANGED)";

      const body: IUpdateUser = {
        phone: "12345678915",
        athleteInfo: {
          // goals DID NOT TOUCH
          goalsAchieved: {
            // UPDATED
            answer: newAnswer,
            question: ATHLETE_FORM_QUESTION["goalsAchieved"],
            section: zAssessmentSection.enum.goals,
          },
          injuriesAndHealthIssues: {
            // ADDED
            answer: "None",
            question: ATHLETE_FORM_QUESTION["injuriesAndHealthIssues"],
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

      const json: AppResponse<IUserFull> = await res.json();

      const user = json.data;

      expect(res.status).toBe(200);
      expect(user?.phone).toBe(body.phone);
      expect(user?._id).toBe(_updatedUser._id.toString());
      expect(user?.name).toBe(_updatedUser.name);
      expect(user?.athleteInfo).toBeTruthy();
      expect(user?.organization.name).toBeTruthy();
      expect(user?.archetype.name).toBeTruthy();

      // UPDATED
      expect(user?.athleteInfo?.goalsAchieved?.answer).toBe(newAnswer);

      // ADDED
      expect(user?.athleteInfo?.injuriesAndHealthIssues).toEqual(
        body.athleteInfo?.injuriesAndHealthIssues
      );

      // DID NOT TOUCH
      expect(user?.athleteInfo?.goals).toEqual(_updatedUser.athleteInfo?.goals);
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
