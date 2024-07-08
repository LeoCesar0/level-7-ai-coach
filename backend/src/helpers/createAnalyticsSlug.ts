import { ICreateAnalytics } from "../@schemas/analytics";

type ICreateAnalyticsSlug = {
  data: Omit<ICreateAnalytics<any>, ""> & { slug?: string };
};

export const createAnalyticsSlug = ({ data }: ICreateAnalyticsSlug) => {
  const { year, month, day, model, type } = data;

  return `${year}-${month}-${day}-${model}-${type}`;
};
