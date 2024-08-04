import { processUserAnalytics } from "../analytics/processUserAnalytics";
import { processChatsAssessment } from "./processChatsAssessment";
import { processJournalsAssessment } from "./processJournalsAssessment";

export const handleDailyProcessing = async () => {
  console.log("------------- 🟢 Start Daily Processing -------------");
  const t1 = new Date();
  console.log("Start daily processing at ", t1.toLocaleString());
  await processUserAnalytics();
  await processJournalsAssessment();
  await processChatsAssessment();
  const t2 = new Date();
  console.log(`Daily processing took ${t2.getTime() - t1.getTime() / 1000}s`);
  console.log("------------- 🔴 End Daily Processing  -------------");
};
