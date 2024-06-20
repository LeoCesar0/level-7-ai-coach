import { z } from "zod";

export const zAppError = z.object({
  _isAppError: z.literal(true),
  _message: z.string().optional(),
  message: z.string(),
  code: z.string().optional(),
});

export type AppError = z.infer<typeof zAppError>;

export type AppResponse<T = any> = {
  data: T | null;
  error: AppError | null;
};
