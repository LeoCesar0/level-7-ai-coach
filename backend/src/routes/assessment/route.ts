import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessment } from "./schemas/assessment";
import { z } from "zod";
import { ChatModel, IChat } from "../chat/schemas/chat";
import { HTTPException } from "hono/http-exception";
import { IUserFull, UserModel } from "../users/schemas/user";
import { processChatAssessment } from "../../services/assessment/processChatAssessment";
import { USER_POPULATES } from "../../static/populates";
import { handleDBSession } from "../../handlers/handleDBSession";
import { zListRouteQueryInput } from "../../@schemas/listRoute";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { processJournalsAssessment } from "../../services/assessment/processJournalsAssessment";
import { stringToDate } from "../../helpers/stringToDate";

const assessmentRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    "process-journals",
    authValidator({ permissionsTo: ["admin"] }),
    async (ctx) => {
      const result = await processJournalsAssessment();

      const resData: AppResponse<boolean> = {
        data: true,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
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
      const { assessment, chat } = await handleDBSession(async (session) => {
        const result = await processChatAssessment({
          chatId,
          user,
          session,
          date: stringToDate(foundChat.createdAt),
        });

        return result;
      });

      const resData: AppResponse<{
        assessment: IAssessment[];
        chat: IChat | null;
      }> = {
        data: {
          assessment,
          chat,
        },
        error: null,
      };
      return ctx.json(resData, 200);
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
  )
  // --------------------------
  // PAGINATE
  // --------------------------
  .post(
    "/list",
    authValidator({ permissionsTo: ["admin", "user", "coach"] }),
    routeValidator({
      schema: zListRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const resData = await handlePaginationRoute<IAssessment>({
        model: AssessmentModel,
        body,
        reqUser,
        modelHasActive: false,
      });

      return ctx.json(resData, 200);
    }
  );

export default assessmentRoute;
