import { ErrorHandler } from "hono";
import { HTTPException } from "hono/http-exception";
import { BlankEnv } from "hono/types";
import { StatusCode } from "hono/utils/http-status";
import { EXCEPTIONS } from "../static/exceptions";
import { AppResponse } from "../@schemas/app";

export const onAppError: ErrorHandler<BlankEnv> = async (err, ctx) => {
  let message = EXCEPTIONS.SERVER_ERROR;
  let status: StatusCode = 500;

  if (err instanceof HTTPException) {
    const httpError = err.getResponse();

    status = httpError.status as StatusCode;
    if (status === 401) {
      message = EXCEPTIONS.NOT_AUTHORIZED;
    }
    const text = await httpError.text();
    const statusText = httpError.statusText;
    console.log("Error is HTTPException");
    console.log("httpError.status", httpError.status);
    console.log("httpError.res", httpError);
    console.log("httpError.statusText", statusText);
    console.log("httpError.text", text);
    console.log("httpError.body", httpError.body);
    console.log("err.message", err.message);

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
