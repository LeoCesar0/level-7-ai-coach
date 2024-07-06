import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessment } from "./schemas/assessment";
import { z } from "zod";
import { ChatModel, IChatFull } from "../chat/schemas/chat";
import { HTTPException } from "hono/http-exception";
import { getChatAssessment } from "../../services/langchain/getChatAssessment";
import { ICreateAssessment } from "./schemas/createAssessment";
import { IUserFull, UserModel } from "../users/schemas/user";

const assessmentRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    "/chat",
    authValidator({ permissionsTo: ["user", "coach", "admin"] }),
    routeValidator({
      schema: z.object({
        chat: z.string(),
      }),
      target: "json",
    }),
    async (ctx) => {
      const { chat: chatId } = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const findChat = await ChatModel.findById(chatId)

      if (!findChat) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      const userId = findChat.user.toString();

      const user = await UserModel.findById<IUserFull>(userId).populate('archetype')

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const { entries } = await getChatAssessment({
        chatId,
        userPreviousData: [],
        userArchetype: user.archetype
      });

      let _entries: ICreateAssessment[] = entries.map((item) => {
        return {
          ...item,
          user: userId,
          chat: chatId,
          journal: undefined,
        };
      });

      const result = await AssessmentModel.insertMany(_entries);

      const resData: AppResponse<IAssessment[]> = {
        data: result,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );
// .post(
//   "/",
//   authValidator({ permissionsTo: ["user", "coach", "admin"] }),
//   routeValidator({
//     schema: zCreateAssessmentRoute,
//     target: "json",
//   }),
//   async (ctx) => {
//     const { entries, userId } = ctx.req.valid("json");
//     // @ts-ignore
//     const reqUser: IUser = ctx.get("reqUser");

//     const _entries = entries.map((item) => ({
//       ...item,
//       userId: userId.toString(),
//     }));

//     const result = await AssessmentModel.insertMany(_entries);

//     const resData: AppResponse<IAssessment[]> = {
//       data: result,
//       error: null,
//     };

//     return ctx.json(resData, 200);
//   }
// );

export default assessmentRoute;
