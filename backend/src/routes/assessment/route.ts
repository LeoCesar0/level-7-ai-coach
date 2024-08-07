import { Hono } from "hono";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessmentDoc } from "./schemas/assessment";
import { z } from "zod";
import { ChatModel, IChatDoc } from "../chat/schemas/chat";
import { HTTPException } from "hono/http-exception";
import { IUserFullDoc, UserModel } from "../users/schemas/user";
import { processChatAssessment } from "../../services/assessment/processChatAssessment";
import { handleDBSession } from "../../handlers/handleDBSession";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute";
import { processJournalsAssessment } from "../../services/assessment/processJournalsAssessment";
import { USER_POPULATES } from "@/static/populates";
import { AppResponse } from "@common/schemas/app";
import { parseToDate } from "@common/helpers/parseToDate";
import { zPaginateRouteQueryInput } from "@common/schemas/pagination";
import { FilterQuery } from "mongoose";
import { EXCEPTIONS } from "@common/static/exceptions";
import { getReqUser } from "@/helpers/getReqUser";
import { processChatsAssessment } from "@/services/assessment/processChatsAssessment";
import { API_ROUTE } from "@common/static/routes";

const ROUTE = API_ROUTE.assessments;

const assessmentRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    ROUTE["process-journals"].path,
    authValidator({ permissionsTo: ROUTE["process-journals"].permissions }),
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
    ROUTE["process-chats"].path,
    authValidator({ permissionsTo: ROUTE["process-chats"].permissions }),
    async (ctx) => {
      const result = await processChatsAssessment();

      const resData: AppResponse<boolean> = {
        data: true,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // PAGINATE
  // --------------------------
  .post(
    ROUTE.paginate.path,
    authValidator({ permissionsTo: ROUTE.paginate.permissions }),
    routeValidator({
      schema: zPaginateRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const reqUser = getReqUser(ctx);

      if (!reqUser) {
        throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
      }

      const obligatoryFilters: FilterQuery<IAssessmentDoc> = {};

      if (reqUser.role === "user") {
        obligatoryFilters.user = reqUser._id.toString();
      }
      if (reqUser.role === "coach" && !body.filters?.user) {
        throw new HTTPException(401, {
          message: "Assessment pagination by coach must inform the user",
        });
      }

      const resData = await handlePaginationRoute<IAssessmentDoc>({
        model: AssessmentModel,
        body,
        obligatoryFilters,
      });

      return ctx.json(resData, 200);
    }
  );
// .post(
//   "/chat/:id",
//   authValidator({ permissionsTo: ["user", "coach", "admin"] }),
//   routeValidator({
//     schema: z.object({
//       id: z.string(),
//     }),
//     target: "param",
//   }),
//   async (ctx) => {
//     const { id: chatId } = ctx.req.valid("param");
//     const reqUser = getReqUser(ctx);

//     if (!reqUser) {
//       throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
//     }

//     const foundChat = await ChatModel.findById(chatId);

//     if (!foundChat) {
//       throw new HTTPException(404, { message: "Chat not found" });
//     }

//     if (!foundChat.closed) {
//       throw new HTTPException(404, { message: "Chat is not finished yet" });
//     }

//     const userId = foundChat.user.toString();

//     const user = await UserModel.findById<IUserFullDoc>(userId).populate(
//       USER_POPULATES
//     );

//     if (!user) {
//       throw new HTTPException(404, { message: "User not found" });
//     }
//     const { assessment, chat } = await handleDBSession(async (session) => {
//       const result = await processChatAssessment({
//         chatId,
//         user,
//         session,
//         date: parseToDate(foundChat.createdAt),
//       });

//       return result;
//     });

//     const resData: AppResponse<{
//       assessment: IAssessmentDoc[];
//       chat: IChatDoc | null;
//     }> = {
//       data: {
//         assessment,
//         chat,
//       },
//       error: null,
//     };
//     return ctx.json(resData, 200);
//   }
// )
// .get(
//   "/chat/:id",
//   authValidator({ permissionsTo: ["user", "coach", "admin"] }),
//   routeValidator({
//     schema: z.object({
//       id: z.string(),
//     }),
//     target: "param",
//   }),
//   async (ctx) => {
//     const { id: chatId } = ctx.req.valid("param");
//     const reqUser = getReqUser(ctx);

//     if (!reqUser) {
//       throw new HTTPException(401, { message: EXCEPTIONS.NOT_AUTHORIZED });
//     }

//     const foundChat = await ChatModel.findById(chatId);

//     if (!foundChat) {
//       throw new HTTPException(404, { message: "Chat not found" });
//     }

//     const assessment = await AssessmentModel.find({ chat: chatId });

//     const resData: AppResponse<IAssessmentDoc[]> = {
//       data: assessment,
//       error: null,
//     };

//     return ctx.json(resData, 200);
//   }
// )

export default assessmentRoute;
