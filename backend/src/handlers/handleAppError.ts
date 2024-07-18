import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { BlankEnv } from "hono/types";
import { StatusCode } from "hono/utils/http-status";
import { ZodError } from "zod";
import { getZodErrorMessage } from "../helpers/getZodErrorMessage";
import { EXCEPTIONS, EXCEPTION_CODE } from "@common/static/exceptions";
import { AppResponse } from "@common/schemas/app";

export const handleAppError: ErrorHandler<BlankEnv> = async (err, ctx) => {
  let message = EXCEPTIONS.SERVER_ERROR;
  let status: StatusCode = 500;

  console.log("❗ err -->", err);

  // @ts-ignore
  const forbiddenUser = ctx.get("forbiddenUser");
  // @ts-ignore
  const invalidToken = ctx.get("expiredToken");

  // --------------------------
  // INVALID TOKEN
  // --------------------------
  if (invalidToken) {
    console.log("❗❗❗ Here Invalid token error");
    status = 401;
    const error: AppResponse = {
      error: {
        message: message,
        _message: EXCEPTION_CODE.EXPIRED_TOKEN,
        code: EXCEPTION_CODE.EXPIRED_TOKEN,
        _isAppError: true,
      },
      data: null,
    };
    return ctx.json(error, status);
  }

  // --------------------------
  // FORBIDDEN
  // --------------------------
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

  // --------------------------
  // ZOD ERROR
  // --------------------------
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

  // --------------------------
  // HTTP EXCEPTION
  // --------------------------
  if (err instanceof HTTPException) {
    const httpError = err.getResponse();

    status = httpError.status as StatusCode;
    if (status === 401) {
      message = EXCEPTIONS.NOT_AUTHORIZED;
    }
    const text = await httpError.text();
    console.log("❗ text -->", text);

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
