import { ModelId } from "../../@schemas/mongoose";
import { ICreateAssessment } from "../../routes/assessment/schemas/createAssessment";
import { ChatModel } from "../../routes/chat/schemas/chat";
import { IUserFull } from "../../routes/users/schemas/user";
import { ClientSession } from "mongoose";
import { getChatHistory } from "../langchain/getChatHistory";
import { getAssessment } from "./helpers/getAssessment";
import { processAssessmentEntries } from "./helpers/processAssessmentEntries";

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

  const chatHistory = getChatHistory({ chatId: chatId.toString() });

  const history = await chatHistory.getMessages(); // message type: BaseMessage[]

  if (history.length < 6) {
    throw new Error("Not enough messages to assess");
  }

  const messages = history
    .map((item) => {
      const type = item._getType();
      return `${type}: ${item.toDict().data.content}`;
    })
    .join("\n");

  const { entries } = await getAssessment({
    messages,
    user,
    userPreviousData: [],
    type: "chat",
  });

  // const { entries } = await getChatAssessment({
  //   chatId: chatId.toString(),
  //   userPreviousData: [],
  //   user,
  // });

  const { createdAssessments } = await processAssessmentEntries({
    chatId: chatId.toString(),
    entries: entries as ICreateAssessment[],
    journalId: undefined,
    session,
    userId,
  });

  const updatedChat = await ChatModel.findByIdAndUpdate(
    chatId.toString(),
    { assessed: true, closed: true },
    { session, new: true }
  );

  // await session.endSession();
  return {
    assessment: createdAssessments,
    chat: updatedChat,
  };
};
