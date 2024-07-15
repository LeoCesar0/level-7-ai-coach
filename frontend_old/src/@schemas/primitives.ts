import { z } from "zod";

export const zStringNotEmpty = z.string().min(1, {
  message: "This field is required.",
});
