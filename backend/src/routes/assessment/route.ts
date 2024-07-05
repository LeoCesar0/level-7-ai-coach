import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessment } from "./schemas/assessment";
import {
  ICreateAssessment,
  zCreateAssessmentRoute,
} from "./schemas/createAssessment";
import { z } from "zod";
import { ChatModel } from "../chat/schemas/chat";
import { HTTPException } from "hono/http-exception";
import { getChatHistory } from "../../services/langchain/getChatHistory";
import { getChatAssessment } from "../../services/langchain/getChatAssessment";

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

      const findChat = await ChatModel.findById(chatId);

      if (!findChat) {
        throw new HTTPException(400, { message: "Chat id not found" });
      }
      const userId = findChat.user.toString();

      // const entries: ICreateAssessment[] = [];

      const result = await getChatAssessment({
        chatId,
        userId,
        userPreviousData: [],
      });

      // const result = await AssessmentModel.insertMany(entries);

      const resData: AppResponse<any> = {
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
