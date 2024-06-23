import { ZodSchema, z } from "zod";
import { AppResponse } from "../@schemas/app";
import { getZodErrorMessage } from "./getZodErrorMessage";
import { zValidator } from "@hono/zod-validator";

export type IRouteValidator<T> = {
  schema: ZodSchema<T>;
};

export const routeValidator = <T>({ schema }: IRouteValidator<T>) => {
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
