import { z } from "zod";

export type IAthleteInfo = z.input<typeof zAthleteInfo>;

const obj = {
  // --------------------------
  // GENERAL INFO
  // --------------------------
  nick: z.string().default(""),
  birthday: z.string().default(""),
  gender: z.string().default(""),
  athleteAsMain: z.boolean(),
  mainJob: z.string().default(""),
  shortTermGoals: z.string().default(""),
  longTermGoals: z.string().default(""),
  // --------------------------
  // WORKOUT
  // --------------------------
  mainWorkoutDescription: z.string().default(""),
  mainWorkoutDuration: z.string().default(""),
  mainWorkoutInterval: z.string().default(""),
  hobbyWorkoutDescription: z.string().default(""),
  hobbyWorkoutDuration: z.string().default(""),
  hobbyWorkoutInterval: z.string().default(""),
  // --------------------------
  // HOBBY
  // --------------------------
  hobbyDescription: z.string().default(""),
  hobbyDuration: z.string().default(""),
  hobbyInterval: z.string().default(""),
  // --------------------------
  // CONDITIONS AND HEALTH
  // --------------------------
  disabilities: z.string().default("").array().default([]),
  pastInjury: z.string().default(""),
  currentInjury: z.string().default(""),
  currentMedicalTreatment: z.string().default(""),
  medicines: z.string().default(""),
  currentDietPlan: z.string().default(""),
  // --------------------------
  // MIND
  // --------------------------
  practiceMeditation: z.boolean().default(false),
  meditationPreference: z.string().default(""),
  // --------------------------
  // Ayurveda
  // --------------------------
  mainDoshas: z.string().default(""),
  q_mind_1: z.string().default(""),
  q_mind_2: z.string().default(""),
  // --------------------------
  //
  // --------------------------
};

export const zAthleteInfo = z.object(obj);
