import { ICreateAnalytics } from "../../@schemas/analytics";
import { createAnalyticsSlug } from "../../helpers/createAnalyticsSlug";
import { getDateFields } from "../../helpers/getDateFields";
import { COLLECTION } from "../../lib/langchain/@static";
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
      slug: "", // ADD BELOW,
    };
    entry.slug = createAnalyticsSlug({ data: entry });

    const collection = getCollection({ name: COLLECTION.USER_ANALYTICS });

    await collection.insertOne(entry);
    console.log("📊 Processed user analytics - count");
  } catch (err) {
    console.log("❗ Error processing user count analytics -->", err);
  }
};
