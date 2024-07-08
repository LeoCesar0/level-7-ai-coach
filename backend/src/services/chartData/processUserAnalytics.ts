import { ICreateAnalytics } from "../../@schemas/analytics";
import { getDateFields } from "../../helpers/getDateFields";
import { UserModel } from "../../routes/users/schemas/user";
import { getCollection } from "../mongodb/getCollection";

export const processUserAnalytics = async () => {
  // --------------------------
  // COUNT
  // --------------------------
  try {
    const totalUsers = await UserModel.find().countDocuments();

    const now = new Date();

    const dateFields = getDateFields({ date: now });

    const entry: ICreateAnalytics<number> = {
      date: now,
      model: "users",
      type: "count",
      value: totalUsers,
      ...dateFields,
    };

    const collection = getCollection({ name: "userAnalytics" });

    await collection.insertOne(entry);
    console.log("📊 Processed user analytics - count");
  } catch (err) {
    console.log("❗ Error processing user count analytics -->", err);
  }
};
