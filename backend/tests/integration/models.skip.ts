import { ICreateOrganization } from "../../src/routes/organizations/schemas/createOrganization";
import { OrganizationModel } from "../../src/routes/organizations/schemas/organization";
import { ICreateUser } from "../../src/routes/users/schemas/createUser";
import { UserModel } from "../../src/routes/users/schemas/user";
import { TestServer } from "../mongodb-memory-server";

describe("test models suite", () => {
  beforeAll(async () => {
    await TestServer.connectTestServer();
  });

  afterAll(async () => {
    await TestServer.disconnectTestServer();
  });

  describe("test", () => {
    it("should test", async () => {
      // --------------------------
      // SETUP
      // --------------------------
      const usersT0 = await UserModel.find();
      const orgsT0 = await OrganizationModel.find();

      expect(usersT0).toHaveLength(0);
      expect(orgsT0).toHaveLength(0);
      // --------------------------
      // CREATE FIRST ORG
      // --------------------------
      const createdOrgT0 = await OrganizationModel.create({
        name: "OrgT0",
      });
      const foundOrgT0 = await OrganizationModel.findById(createdOrgT0.id);
      expect(foundOrgT0?.name).toBe("OrgT0");
      expect(foundOrgT0?.users).toHaveLength(0);
      // --------------------------
      // CREATE USER T0 AND SET ORGANIZATION ID OF T0
      // --------------------------
      const userBody0 = {
        name: "UserT0",
        active: true,
        email: "anyemail@test.com",
        role: "user",
        organization: createdOrgT0.id,
        firebaseId: "123456",
      };
      const createdUserT0 = await UserModel.create(userBody0);
      const foundUserT0 = await UserModel.findById(createdUserT0.id);
      expect(foundUserT0?.name).toBe(userBody0.name);
      expect(foundUserT0?.organization.toString()).toBe(createdOrgT0.id);
      // --------------------------
      // CHECK ORG WAS UPDATED
      // --------------------------
      const foundOrgT1 = await OrganizationModel.findById(createdOrgT0.id);
      expect(foundOrgT1?.users && foundOrgT1?.users.length > 0).toBe(true);
      expect(
        foundOrgT1?.users.find((orgId) => orgId.toString() === createdUserT0.id)
      );
      // --------------------------
      // CREATE ORG WITH USER
      // --------------------------
      const user2 = await UserModel.create({
        name: "User 2",
        active: true,
        email: "anyemail@test.com",
        role: "user",
        firebaseId: "123456",
        organization: createdOrgT0.id,
      });
      const createdOrg2 = await OrganizationModel.create({
        name: "Org 2",
        users: [user2.id],
      });
      const foundOrg2 = await OrganizationModel.findById(createdOrg2.id);
      expect(foundOrg2?.name).toBe("Org 2");
      expect(foundOrg2?.users).toHaveLength(1);
      expect(foundOrg2?.users[0].toString()).toBe(user2.id);
      const foundUser2 = await UserModel.findById(user2.id);
      expect(foundUser2?.organization.toString()).toBe(createdOrg2.id);
      // --------------------------
      // UPDATE USER 2 ORGANIZATION
      // --------------------------
      await UserModel.updateOne(
        { _id: user2.id },
        { organization: createdOrgT0.id }
      );
      const foundUser2Updated = await UserModel.findById(user2.id);
      expect(foundUser2Updated?.organization.toString()).toBe(createdOrgT0.id);

      const foundOrgT2 = await OrganizationModel.findById(createdOrgT0.id);
      expect(
        foundOrgT2?.users.find((userId) => userId.toString() === user2.id)
      ).toBeTruthy();
      // --------------------------
      // DELETE USER 2, CHECK ORG WAS UPDATED
      // --------------------------
      //   await UserModel.deleteOne({
      //     _id: user2.id,
      //   });
      //   const foundOrgT3 = await OrganizationModel.findById(createdOrgT0.id);
      //   expect(
      //     foundOrgT3?.users.find((userId) => userId.toString() === user2.id)
      //   ).toBeFalsy();
    });
  });
});
