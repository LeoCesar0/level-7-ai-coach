import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { BlankEnv } from "hono/types";
import { StatusCode } from "hono/utils/http-status";
import { EXCEPTIONS } from "../static/exceptions";
import { AppResponse } from "../@schemas/app";
import { ZodError } from "zod";
import { getZodErrorMessage } from "../helpers/getZodErrorMessage";

export const onAppError: ErrorHandler<BlankEnv> = async (err, ctx) => {
  let message = EXCEPTIONS.SERVER_ERROR;
  let status: StatusCode = 500;

  // @ts-ignore
  const forbiddenUser = ctx.get("forbiddenUser");

  console.log("❗ app err -->", err);

  if (forbiddenUser) {
    status = 403;
    message = EXCEPTIONS.FORBIDDEN;
    const error: AppResponse = {
      error: {
        message: message,
        _message: EXCEPTIONS.FORBIDDEN,
        _isAppError: true,
      },
      data: null,
    };
    return ctx.json(error, status);
  }

  if (err instanceof ZodError) {
    console.log("ZOD ERROR INSTANCE");
    message = getZodErrorMessage({ error: err });
    status = 422;
    ctx.status(status);
    const error: AppResponse = {
      error: {
        message: message,
        _message: EXCEPTIONS.VALIDATION_ERROR,
        _isAppError: true,
      },
      data: null,
    };
    return ctx.json(error, status);
  }

  if (err instanceof HTTPException) {
    const httpError = err.getResponse();

    status = httpError.status as StatusCode;
    if (status === 401) {
      message = EXCEPTIONS.NOT_AUTHORIZED;
    }
    // const text = await httpError.text();
    // const statusText = httpError.statusText;
    // console.log("Error is HTTPException");
    // console.log("httpError.status", httpError.status);
    // console.log("httpError.res", httpError);
    // console.log("httpError.statusText", statusText);
    // console.log("httpError.text", text);
    // console.log("httpError.body", httpError.body);
    // console.log("err.message", err.message);

    ctx.status(status);
  }

  const error: AppResponse = {
    error: {
      message: message,
      _message: err.message || "",
      _isAppError: true,
    },
    data: null,
  };
  return ctx.json(error, status);
};
