import { Hono } from "hono";
import { IJournalDoc, JournalModel } from "./schemas/journal.js";
import { routeValidator } from "../../middlewares/routeValidator.js";
import { authValidator } from "../../middlewares/authValidator.js";
import { HTTPException } from "hono/http-exception";
import { getUserFull } from "../../services/getUserFull.js";
import { zPaginateRouteQueryInput } from "@/@schemas/paginateRoute.js";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute.js";
import { z } from "zod";
import { zStringNotEmpty } from "../../@schemas/primitives/stringNotEmpty.js";
import { AppResponse } from "@common/schemas/app.js";
import { zCreateJournal } from "@common/schemas/journal/createJournal.js";
import { zJournal } from "@common/schemas/journal/journal.js";
import { IUserDoc } from "../users/schemas/user.js";

// --------------------------
// GET
// --------------------------
export const journalRoute = new Hono()
  .get(
    "/:id",
    routeValidator({
      schema: z.object({ id: zStringNotEmpty }),
      target: "param",
    }),
    authValidator({ permissionsTo: ["admin", "coach", "user"] }),
    async (ctx) => {
      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUserDoc;

      let resData: AppResponse<IJournalDoc>;

      const { id: journalId } = ctx.req.valid("param");

      const journal = await JournalModel.findById(journalId);

      if (!journal) {
        resData = {
          data: null,
          error: {
            _isAppError: true,
            message: "Journal not found or deleted",
          },
        };
        return ctx.json(resData, 404);
      }

      const journalObj = journal?.toObject();

      resData = {
        data: journalObj,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // LIST
  // --------------------------
  .post(
    "/list",
    authValidator({ permissionsTo: ["admin", "user", "coach"] }),
    routeValidator({
      schema: zPaginateRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const resData = await handlePaginationRoute<IJournalDoc>({
        model: JournalModel,
        body,
        reqUser,
        modelHasActive: false,
      });

      return ctx.json(resData, 200);
    }
  )
  // --------------------------
  // CREATE
  // --------------------------
  .post(
    "/",
    routeValidator({
      schema: zCreateJournal,
    }),
    authValidator({
      permissionsTo: ["user"],
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const { date, images, draft, text } = body;

      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUserDoc;

      const userId = reqUser._id.toString();

      const user = await getUserFull({ userId });

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const newJournal = await JournalModel.create({
        user: userId,
        date: date,
        images: images ?? [],
        text,
        draft,
      });
      const journal = newJournal.toObject();

      const resData: AppResponse<IJournalDoc> = {
        data: journal,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .put(
    "/:id",
    routeValidator({
      schema: z.object({ id: zStringNotEmpty }),
      target: "param",
    }),
    routeValidator({
      schema: zJournal.partial(),
    }),
    authValidator({
      permissionsTo: ["user"],
    }),
    async (ctx) => {
      const values = ctx.req.valid("json");
      const { id: journalId } = ctx.req.valid("param");

      if (!values || !Object.keys(values).length) {
        throw new HTTPException(400, { message: "No data to update" });
      }

      let resData: AppResponse<IJournalDoc>;

      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUserDoc;

      const userId = reqUser._id.toString();

      const user = await getUserFull({ userId });

      if (!user) {
        throw new HTTPException(404, { message: "User not found" });
      }

      const newJournal = await JournalModel.findOneAndUpdate(
        {
          _id: journalId,
        },
        {
          ...values,
        },
        { new: true }
      );

      if (!newJournal) {
        throw new HTTPException(404, { message: "Journal not found" });
      }

      const journal = newJournal.toObject();

      resData = {
        data: journal,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  )
  .delete(
    "/:id",
    routeValidator({
      schema: z.object({ id: zStringNotEmpty }),
      target: "param",
    }),
    authValidator({
      permissionsTo: ["user", "admin"],
    }),
    async (ctx) => {
      const values = ctx.req.valid("json");
      const { id: journalId } = ctx.req.valid("param");

      let resData: AppResponse<boolean>;

      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUserDoc;

      const userId = reqUser._id.toString();

      const foundJournal = await JournalModel.findById(journalId);

      if (!foundJournal) {
        resData = {
          data: null,
          error: {
            _isAppError: true,
            message: "Journal not found",
          },
        };
        return ctx.json(resData, 404);
      }

      if (foundJournal.user.toString() !== userId.toString()) {
        throw new HTTPException(403, { message: "Forbidden" });
      }

      await JournalModel.deleteOne({
        _id: journalId,
      });

      resData = {
        data: true,
        error: null,
      };

      return ctx.json(resData, 200);
    }
  );

// .get(
//   "/",
//   authValidator({ permissionsTo: ["admin", "coach", "user"] }),
//   async (ctx) => {
//     // @ts-ignore
//     const reqUser = ctx.get("reqUser") as IUserDoc;
//     let list: IJournalDoc[] = [];

//     if (reqUser.role === "admin") {
//       list = await JournalModel.find();
//     } else if (reqUser.role === "coach") {
//       list = await JournalModel.find({ organization: reqUser.organization });
//     } else if (reqUser.role === "user") {
//       list = await JournalModel.find({ user: reqUser._id });
//     }

//     const resData: AppResponse<IJournalDoc[]> = {
//       data: list,
//       error: null,
//     };

//     return ctx.json(resData, 200);
//   }
// )
