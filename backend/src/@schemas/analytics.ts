import { IMongoDocument } from "@common/schemas/mongo";

export type IDateFields = {
  year: number;
  month: number;
  day: number;
};

export type IAnalytics<T> = {
  date: string;
  type: string;
  model: string;
  value: T;
  slug: string;
} & IMongoDocument;

export type ICreateAnalytics<T> = {
  date: Date;
  model: string;
  type: string;
  value: T;
  slug: string;
} & IDateFields;
