import { z } from "zod";
import { AppResponse } from "../@schemas/app";
import { getZodErrorMessage } from "../helpers/getZodErrorMessage";
import { zValidator } from "@hono/zod-validator";
import { handleZodSafeError } from "../handlers/handleZodSafeError";

export type IRouteValidator<T extends z.ZodType<any, z.ZodTypeDef, any>> = {
  schema: T;
  target?: Parameters<typeof zValidator>[0];
};

export const routeValidator = <T extends z.ZodType<any, z.ZodTypeDef, any>>({
  schema,
  target = "json",
}: IRouteValidator<T>) => {
  return zValidator(target, schema, (result, ctx) => {
    if (!result.success) {
      return handleZodSafeError({ ctx, result });
    }
  });
};
