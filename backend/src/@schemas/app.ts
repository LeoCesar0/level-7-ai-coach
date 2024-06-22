import { ZodError } from "zod";

export type AppError = {
  _isAppError: true;
  _zodError?: ZodError;
  message: string;
  code?: string | undefined;
  _message?: string | undefined;
};

export type AppResponse<T = any> = {
  data: T | null;
  error: AppError | null;
};
