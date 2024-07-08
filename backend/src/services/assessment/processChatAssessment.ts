import mongoose from "mongoose";
import { ModelId } from "../../@schemas/mongoose";
import { AssessmentModel } from "../../routes/assessment/schemas/assessment";
import { ICreateAssessment } from "../../routes/assessment/schemas/createAssessment";
import { ChatModel } from "../../routes/chat/schemas/chat";
import { IUserFull } from "../../routes/users/schemas/user";
import { getChatAssessment } from "../langchain/getChatAssessment";
import { ClientSession } from "mongoose";

export type IProcessChatAssessment = {
  chatId: ModelId;
  user: IUserFull;
  session: ClientSession;
};

export const processChatAssessment = async ({
  chatId,
  user,
  session,
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

  await AssessmentModel.deleteMany(
    {
      chat: chatId.toString(),
      journal: undefined,
    },
    { session }
  );

  const result = await AssessmentModel.insertMany(_entries, { session });

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId.toString(),
    { assessed: true, closed: true },
    { session, new: true }
  );

  // await session.endSession();
  return {
    assessment: result,
    chat: updatedChat,
  };
};
