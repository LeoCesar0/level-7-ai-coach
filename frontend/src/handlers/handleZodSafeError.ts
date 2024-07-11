import { Context } from "hono";
import { AppResponse } from "@common/schemas/app";
import { SafeParseError, ZodError } from "zod";
import { getZodErrorMessage } from "@/helpers/getZodErrorMessage";

export type IHandleZodSafeError = {
  ctx: Context;
  result: SafeParseError<any>;
};

export const handleZodSafeError = ({ ctx, result }: IHandleZodSafeError) => {
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
};
