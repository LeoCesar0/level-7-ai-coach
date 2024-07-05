import { Hono } from "hono";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { authValidator } from "../../middlewares/authValidator";
import { AssessmentModel, IAssessment } from "./schemas/assessment";
import { zCreateAssessmentRoute } from "./schemas/createAssessment";

const athleteEntryRoute = new Hono()
  // --------------------------
  // create
  // --------------------------
  .post(
    "/",
    authValidator({ permissionsTo: ["user", "coach", "admin"] }),
    routeValidator({
      schema: zCreateAssessmentRoute,
      target: "json",
    }),
    async (ctx) => {
      const { entries, userId } = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const _entries = entries.map((item) => ({
        ...item,
        userId: userId.toString(),
      }));

      const result = await AssessmentModel.insertMany(_entries);

      const resData: AppResponse<IAssessment[]> = {
        data: result,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

export default athleteEntryRoute;
