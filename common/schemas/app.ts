import { ZodError } from "zod";

export type AppError = {
  _isAppError: true;
  _zodError?: ZodError;
  message: string;
  code?: string | undefined;
  _message?: string | undefined;
  _data?: any;
};

// export type AppResponse<T = any> = {
//   data: T | null;
//   error: AppError | null;
// };

export type AppResponse<T = any> =
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: AppError;
    };
