import { JournalModel } from "../../routes/journals/schemas/journal";
import { getUserFull } from "../getUserFull";
import { getAssessment } from "./helpers/getAssessment";
import { processAssessmentEntries } from "./helpers/processAssessmentEntries";
import { handleDBSession } from "../../handlers/handleDBSession";
import { createNullishFilter } from "../../helpers/createNullishFilter";
import { subHours } from "date-fns";
import { IUserFullDoc } from "@/routes/users/schemas/user";
import { parseToDate } from "@common/helpers/parseToDate";
import { ChatModel } from "@/routes/chat/schemas/chat";
import { processChatAssessment } from "./processChatAssessment";

// --------------------------
// Process all chats that should be assessed. To be used globally and scheduled.
// --------------------------

export const getChatsToAssess = async () => {
  const now = new Date();
  const chats = await ChatModel.find({
    assessed: { $in: [null, undefined, false] },
    $or: [{ closed: true }, { updatedAt: { $lte: subHours(now, 12) } }], // chats that are open for more than 12h will be processed and closed
  });
  return chats;
};

export const processChatsAssessment = async () => {
  const usersMap = new Map<string, IUserFullDoc>();

  const t1 = new Date();

  const chats = await getChatsToAssess();

  let completedAssessment = 0;
  for (const chat of chats) {
    try {
      await handleDBSession(async (session) => {
        const userId = chat.user.toString();
        const chatId = chat._id.toString();

        let user: IUserFullDoc | undefined = usersMap.get(userId);
        if (!user) {
          user = (await getUserFull({ userId })) ?? undefined;
          if (user) {
            usersMap.set(userId, user);
          }
        }
        if (!user) {
          return;
        }
        await processChatAssessment({
          chatId,
          date: parseToDate(chat.date),
          session,
          user,
        });
        completedAssessment += 1;
      });
    } catch (err) {
      console.log("❌ Error processing chat entry -->", err);
    }
  }
  const t2 = new Date();
  console.log(
    `📊 Chats Assessment: completed ${completedAssessment} of ${
      chats.length
    } chats assessment. Took ${
      (t2.getTime() - t1.getTime()) / 1000
    }s. At ${t1.toLocaleString()}`
  );
};
