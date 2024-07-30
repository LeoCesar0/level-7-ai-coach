import { z } from "zod";
import { zIsoDate } from "./isoDate";
import { parseToDate } from "../../helpers/parseToDate";

export const zFlexDate = zIsoDate.or(z.coerce.date()).transform((value) => {
  return parseToDate(value);
});
