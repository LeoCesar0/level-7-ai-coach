import { z } from "zod";

export const zIsoDate = z.string().superRefine((value, ctx) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Invalid date",
    });
    return false;
  }
  return true;
});
