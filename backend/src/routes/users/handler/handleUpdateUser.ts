import { IUpdateUser } from "@common/schemas/user/updateUserRoute";
import { IUserDoc, IUserFullDoc, UserModel } from "../schemas/user";
import { HTTPException } from "hono/http-exception";
import { AppResponse } from "@common/schemas/app";
import cloneDeep from "lodash.clonedeep";
import { EXCEPTIONS } from "@common/static/exceptions";
import { OrganizationModel } from "@/routes/organizations/schemas/organization";
import { getUserFull } from "@/services/getUserFull";

export type IHandleUpdateUser = {
  inputs: IUpdateUser;
  reqUser: IUserDoc | null;
  userId?: string;
};

export const handleUpdateUser = async ({
  inputs,
  reqUser,
  userId,
}: IHandleUpdateUser) => {
  if (!inputs || !Object.keys(inputs).length) {
    throw new HTTPException(400, { message: "No data to update" });
  }

  if (!userId) {
    throw new HTTPException(400, { message: "User id is required" });
  }

  let resData: AppResponse<IUserFullDoc>;

  const userValues = cloneDeep(inputs);

  const userToChange = await UserModel.findById(userId);

  if (!userToChange) {
    throw new HTTPException(404, { message: "User not found" });
  }

  const isSameOrg =
    reqUser?.organization.toString() === userToChange.organization?.toString();

  if (
    !reqUser || // NO REQ USER
    (reqUser.role === "user" && reqUser._id.toString() !== userId.toString()) || // REQ USER IS USER AND NOT THE SAME USER
    (reqUser.role === "coach" && !isSameOrg) // REQ USER IS COACH AND NOT THE SAME ORG
  ) {
    throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
  }

  const infoKey: keyof typeof userValues = "athleteInfo";
  const infoObject = Object.entries(userValues[infoKey] || {}).reduce(
    (acc, [key, value]) => {
      acc[`${infoKey}.${key}`] = value;
      return acc;
    },
    {} as Record<string, any>
  );

  let values: typeof userValues = cloneDeep(userValues);
  delete values.athleteInfo;

  const updatedUserDoc = await UserModel.findByIdAndUpdate(
    userId,
    {
      ...values,
      $set: infoObject,
    },
    {
      new: true,
    }
  );

  if (!updatedUserDoc) {
    throw new HTTPException(404, { message: "User not found" });
  }
  let updatedUser = updatedUserDoc.toObject();

  const prevOrg = userToChange.organization?.toString();
  const newOrg = updatedUser.organization?.toString();
  const changedOrg = newOrg && prevOrg !== newOrg;
  if (changedOrg) {
    await OrganizationModel.updateMany(
      {
        _id: prevOrg,
      },
      {
        $pull: { users: userId },
      }
    );
    await OrganizationModel.updateMany(
      {
        _id: newOrg,
      },
      {
        $addToSet: { users: userId },
      }
    );
  }

  const finalRes = await getUserFull({ userId });

  if (!finalRes) {
    throw new HTTPException(404, { message: "User not found" });
  }

  resData = {
    data: finalRes,
    error: null,
  };
  return resData;
};
