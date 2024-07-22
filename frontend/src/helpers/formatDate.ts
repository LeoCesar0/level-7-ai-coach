import { stringToDate } from "@common/helpers/stringToDate";

type Options = {
  time?: boolean;
};

export const formatDate = (
  date: string | Date | undefined,
  { time = false }: Options = {}
) => {
  if (!date) return "";
  const _date = stringToDate(date);

  if (time) {
    return _date.toLocaleString();
  }
  return _date.toLocaleDateString();
};
