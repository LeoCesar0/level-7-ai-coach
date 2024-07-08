import { IDateFields } from "../@schemas/analytics";

export const getDateFields = ({ date }: { date: Date }): IDateFields => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return {
    year,
    month,
    day,
  };
};
