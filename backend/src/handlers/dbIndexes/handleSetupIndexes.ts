import { upsertUserSearchIndex } from "./upsertUserSearchIndex";

export const handleSetupIndexes = async () => {
  // --------------------------
  // USER SEARCH INDEX
  // --------------------------
  await upsertUserSearchIndex();
  // await upsertUserAutocomplete();
};
