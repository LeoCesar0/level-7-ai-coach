import { ClientSession } from "mongoose";
import {
  IAssessmentAIResponse,
  ICreateAssessment,
} from "../../../routes/assessment/schemas/createAssessment";
import { AssessmentModel } from "../../../routes/assessment/schemas/assessment";

export type IProcessAssessmentEntries = {
  entries: IAssessmentAIResponse[];
  userId: string;
  chatId: string | undefined;
  journalId: string | undefined;
  session: ClientSession;
};

export const processAssessmentEntries = async ({
  chatId,
  session,
  entries,
  journalId,
  userId,
}: IProcessAssessmentEntries) => {
  let _entries: ICreateAssessment[] = entries.map((item) => {
    return {
      ...item,
      user: userId,
      chat: chatId,
      journal: journalId,
    };
  });

  const deleteFilters: Record<string, any> = {
    chat: chatId,
  };
  if (journalId) deleteFilters.journal = journalId;
  if (userId) deleteFilters.user = userId;

  await AssessmentModel.deleteMany(
    {
      ...deleteFilters,
    },
    { session }
  );

  const createdAssessments = await AssessmentModel.insertMany(_entries, {
    session,
  });

  return {
    createdAssessments,
  };
};
