import { ModelId } from "../@schemas/mongoose";
import { AssessmentModel } from "../routes/assessment/schemas/assessment";
import { ICreateAssessment } from "../routes/assessment/schemas/createAssessment";
import { ChatModel } from "../routes/chat/schemas/chat";
import { IUserFull } from "../routes/users/schemas/user";
import { getChatAssessment } from "./langchain/getChatAssessment";

export type IProcessChatAssessment = {
  chatId: ModelId;
  user: IUserFull;
};

export const processChatAssessment = async ({
  chatId,
  user,
}: IProcessChatAssessment) => {
  const userId = user._id.toString();

  const { entries } = await getChatAssessment({
    chatId: chatId.toString(),
    userPreviousData: [],
    user,
  });

  let _entries: ICreateAssessment[] = entries.map((item) => {
    return {
      ...item,
      user: userId,
      chat: chatId,
      journal: undefined,
    };
  });

  await AssessmentModel.deleteMany({
    chat: chatId.toString(),
    journal: undefined,
  });

  const result = await AssessmentModel.insertMany(_entries);

  await ChatModel.updateOne({ _id: chatId.toString() }, { assessed: true });

  return result;
};
