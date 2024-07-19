import { ObjectId, Types } from 'mongoose';

export type ClientParser<T> = {
  [K in keyof T]: T[K] extends Date ? string : T[K] extends ObjectId ? string : T[K] extends object ? ClientParser<T[K]> : T[K];
};
