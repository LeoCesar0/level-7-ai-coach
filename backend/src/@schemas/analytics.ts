import { z } from "zod";
import { zIsoDate } from "./primitives/isoDate";
import { IMongoDocument, zMongoDocument } from "./mongoose";

export const zCreateAnalytics = z.object({
  date: z.date(),
  model: z.string(),
  type: z.string(),
  value: z.any(),
  year: z.number(),
  month: z.number(),
  day: z.number(),
});

export const zAnalytics = zCreateAnalytics
  .omit({ date: true })
  .merge(
    z.object({
      date: z.string(),
    })
  )
  .merge(zMongoDocument);

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
} & IMongoDocument;

export type ICreateAnalytics<T> = {
  date: Date;
  model: string;
  type: string;
  value: T;
} & IDateFields;
