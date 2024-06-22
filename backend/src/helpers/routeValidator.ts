import { ZodSchema } from "zod";
import { AppResponse } from "../@schemas/app";
import { getZodErrorMessage } from "./getZodErrorMessage";
import { zValidator } from "@hono/zod-validator";

export type IRouteValidator = {
  schema: ZodSchema;
};

export const routeValidator = ({ schema }: IRouteValidator) => {
  return zValidator("json", schema, (result, ctx) => {
    if (!result.success) {
      const message = getZodErrorMessage({ error: result.error });
      const res: AppResponse<any> = {
        data: null,
        error: {
          message: "Validation Error: " + message,
          _message: message,
          _isAppError: true,
          _zodError: result.error,
        },
      };
      return ctx.json(res, 422);
    }
  });
};
