import { JournalModel } from "../../routes/journals/schemas/journal";
import { getUserFull } from "../getUserFull";
import { getAssessment } from "./helpers/getAssessment";
import { processAssessmentEntries } from "./helpers/processAssessmentEntries";
import { handleDBSession } from "../../handlers/handleDBSession";
import { createNullishFilter } from "../../helpers/createNullishFilter";
import { subHours } from "date-fns";
import { IUserFullDoc } from "@/routes/users/schemas/user";
import { parseToDate } from "@common/helpers/parseToDate";

// --------------------------
// Process all journals that should be assessed. To be used globally and scheduled.
// --------------------------

export const getJournalsToAssess = async () => {
  const now = new Date();

  const journals = await JournalModel.find({
    shouldAssess: true,
    draft:{ $in: [null, undefined, false] },
    createdAt: {
      $lt: subHours(now, 6), // JOURNAL SHOULD BE CREATED AT LEAST 6 HOURS AGO
    },
  });
  return journals;
};

export const processJournalsAssessment = async () => {
  const usersMap = new Map<string, IUserFullDoc>();

  const journals = await getJournalsToAssess();

  let completedAssessment = 0;
  const t1 = new Date();

  for (const journal of journals) {
    // --------------------------
    // GET USER
    // --------------------------
    try {
      await handleDBSession(async (session) => {
        const userId = journal.user.toString();
        const journalId = journal._id.toString();

        let user: IUserFullDoc | undefined = usersMap.get(userId);
        if (!user) {
          user = (await getUserFull({ userId })) ?? undefined;
          if (user) {
            usersMap.set(userId, user);
          }
        }
        if (!user || !journal.text) {
          return;
        }
        // --------------------------
        const { entries } = await getAssessment({
          messages: journal.text,
          type: "journal",
          user,
          userPreviousData: [],
        });

        const { createdAssessments } = await processAssessmentEntries({
          chatId: undefined,
          journalId,
          entries,
          session,
          userId,
          date: parseToDate(journal.date),
        });

        const updatedJournal = await JournalModel.findByIdAndUpdate(
          journalId,
          { assessed: true, shouldAssess: false },
          { session, new: true }
        );

        console.log(
          `Created ${createdAssessments.length} entries to a journal`
        );
      });
      completedAssessment += 1;
    } catch (err) {
      console.log("❌ Error processing journal entry -->", err);
    }
  }
  const t2 = new Date();
  console.log(
    `📊 Journals Assessment: completed ${completedAssessment} of ${
      journals.length
    } journals assessment. Took ${
      (t2.getTime() - t1.getTime()) / 1000
    }s. At ${t1.toLocaleString()}`
  );
};
