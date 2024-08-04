import { ENV } from "@common/static/envs";
import { upsertUserSearchIndex } from "./upsertUserSearchIndex";

export const handleSetupIndexes = async () => {
  // --------------------------
  // USER SEARCH INDEX
  // --------------------------
  if (process.env.NODE_ENV === ENV.TEST) return;

  await upsertUserSearchIndex();
  // await upsertUserAutocomplete();
};
