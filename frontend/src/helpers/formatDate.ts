import { parseToDate } from "@common/helpers/parseToDate";

type Options = {
  time?: boolean;
};

export const formatDate = (
  date: string | Date | number | undefined,
  { time = false }: Options = {}
) => {
  if (!date) return "";
  const _date = parseToDate(date);

  if (time) {
    return _date.toLocaleString();
  }
  return _date.toLocaleDateString();
};
