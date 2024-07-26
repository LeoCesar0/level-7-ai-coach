import { parseToDate } from "@common/helpers/parseToDate";
import { differenceInYears, format } from "date-fns";

export const getYearsOld = (date: string | Date | undefined) => {
  if (!date) return "";
  const _date = parseToDate(date);
  const now = new Date();

  const diff = differenceInYears(now, _date);
  return diff;
};
