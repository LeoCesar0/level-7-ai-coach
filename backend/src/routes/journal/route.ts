import { Hono } from "hono";
import { IUser } from "../users/schemas/user.js";
import { JournalModel, IJournal } from "./schemas/journal.js";
import { routeValidator } from "../../middlewares/routeValidator.js";
import { zCreateJournal } from "./schemas/createJournal.js";
import { AppResponse } from "../../@schemas/app.js";
import { authValidator } from "../../middlewares/authValidator.js";
import { HTTPException } from "hono/http-exception";
import { getUserFull } from "../../services/getUserFull.js";
import { zListRouteQueryInput } from "../../@schemas/listRoute.js";
import { handlePaginationRoute } from "../../handlers/handlePaginationRoute.js";
import { z } from "zod";
import { zStringNotEmpty } from "../../@schemas/primitives/stringNotEmpty.js";

// --------------------------
// GET MANY
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
      const reqUser = ctx.get("reqUser") as IUser;

      let resData: AppResponse<IJournal>;

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
      schema: zListRouteQueryInput,
      target: "json",
    }),
    async (ctx) => {
      const body = ctx.req.valid("json");
      // @ts-ignore
      const reqUser: IUser = ctx.get("reqUser");

      const resData = await handlePaginationRoute<IJournal>({
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
      const { date, images, draft, text } = ctx.req.valid("json");

      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUser;

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

      const resData: AppResponse<IJournal> = {
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
      schema: zCreateJournal.partial(),
    }),
    authValidator({
      permissionsTo: ["user"],
    }),
    async (ctx) => {
      const values = ctx.req.valid("json");
      const { id: journalId } = ctx.req.valid("param");

      let resData: AppResponse<IJournal>;

      // @ts-ignore
      const reqUser = ctx.get("reqUser") as IUser;

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
      const reqUser = ctx.get("reqUser") as IUser;

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
//     const reqUser = ctx.get("reqUser") as IUser;
//     let list: IJournal[] = [];

//     if (reqUser.role === "admin") {
//       list = await JournalModel.find();
//     } else if (reqUser.role === "coach") {
//       list = await JournalModel.find({ organization: reqUser.organization });
//     } else if (reqUser.role === "user") {
//       list = await JournalModel.find({ user: reqUser._id });
//     }

//     const resData: AppResponse<IJournal[]> = {
//       data: list,
//       error: null,
//     };

//     return ctx.json(resData, 200);
//   }
// )