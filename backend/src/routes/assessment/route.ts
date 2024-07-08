import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessment } from "./schemas/assessment";
import { z } from "zod";
import { ChatModel, IChat } from "../chat/schemas/chat";
import { HTTPException } from "hono/http-exception";
import { IUserFull, UserModel } from "../users/schemas/user";
import { processChatAssessment } from "../../services/processChatAssessment";
import { USER_POPULATES } from "../../static/populates";
import { handleDBSession } from "../../handlers/handleDBSession";

const assessmentRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    "/chat/:id",
    authValidator({ permissionsTo: ["user", "coach", "admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id: chatId } = ctx.req.valid("param");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const foundChat = await ChatModel.findById(chatId);

      if (!foundChat) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      if (!foundChat.closed) {
        throw new HTTPException(404, { message: "Chat is not finished yet" });
      }

      const userId = foundChat.user.toString();

      const user = await UserModel.findById<IUserFull>(userId).populate(
        USER_POPULATES
      );

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }
      handleDBSession(async (session) => {
        const result = await processChatAssessment({
          chatId,
          user,
          session,
        });

        const resData: AppResponse<{
          assessment: IAssessment[];
          chat: IChat | null;
        }> = {
          data: result,
          error: null,
        };

        return ctx.json(resData, 200);
      });
    }
  )
  .get(
    "/chat/:id",
    authValidator({ permissionsTo: ["user", "coach", "admin"] }),
    routeValidator({
      schema: z.object({
        id: z.string(),
      }),
      target: "param",
    }),
    async (ctx) => {
      const { id: chatId } = ctx.req.valid("param");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const foundChat = await ChatModel.findById(chatId);

      if (!foundChat) {
        throw new HTTPException(404, { message: "Chat not found" });
      }

      const assessment = await AssessmentModel.find({ chat: chatId });

      const resData: AppResponse<IAssessment[]> = {
        data: assessment,
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
