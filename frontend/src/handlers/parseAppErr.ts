import { AppError } from "@common/schemas/app";

export const parseAppError = (err: any) => {
  if (err?._isAppError) {
    let error: AppError = err;
    return error;
  }
};
