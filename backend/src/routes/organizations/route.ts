import { Hono } from "hono";
import {
  OrganizationModel,
  Organization,
  zCreateOrganization,
} from "./schemas/organization";
import { AppResponse } from "../../@schemas/app";
import { routeValidator } from "../../middlewares/routeValidator";
import { z } from "zod";
import { EXCEPTIONS } from "../../static/exceptions";

const organizationsRoute = new Hono()
  // --------------------------
  // LIST
  // --------------------------
  .get("/", async (ctx) => {
    const list = await OrganizationModel.find();

    const resData: AppResponse<Organization[]> = {
      data: list,
      error: null,
    };

    return ctx.json(resData);
  })
  // --------------------------
  // GET BY ID
  // --------------------------
  .get("/:id", async (ctx) => {
    const id = ctx.req.param("id");

    const item = await OrganizationModel.findById(id);

    const resData: AppResponse<Organization> = {
      data: item,
      error: null,
    };

    return ctx.json(resData);
  })
  // --------------------------
  // CREATE
  // --------------------------
  .post("/", routeValidator({ schema: zCreateOrganization }), async (ctx) => {
    const input = ctx.req.valid("json");

    const createdDoc = await OrganizationModel.create(input);

    const createdItem = createdDoc.toObject();
    const resData: AppResponse<Organization> = {
      data: createdItem,
      error: null,
    };

    return ctx.json(resData, 200);
  });

export default organizationsRoute;
