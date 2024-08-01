import { z } from "zod";
import { zAssessmentKey, zAssessmentSection } from "../assessment/enums";

export type IAthleteInfo = z.output<typeof zAthleteInfo>;
export type IAthleteInfoKey = z.infer<typeof zAthleteInfoKey>;
export type IAthleteFormSection = z.infer<typeof zAthleteInfoSection>;

export type IAthleteFormQuestion = {
  section: IAthleteFormSection;
  key: IAthleteInfoKey;
  question: string;
};

export const zAthleteInfoSection = zAssessmentSection.or(z.enum(["personal"]));
export const zAthleteInfoKey = z
  .enum(["sportAndExperience", "currentTrainingRegime"])
  .or(zAssessmentKey);

export const zAthleteInfoItem = z.object({
  section: zAthleteInfoSection,
  question: z.string(),
  answer: z.string().or(z.number()),
});

export const zAthleteInfo = z.record(zAthleteInfoKey, zAthleteInfoItem);

// --------------------------
// ENUM
// --------------------------

export const ATHLETE_FORM_QUESTION: Record<IAthleteInfoKey, string> = {
  // --------------------------
  // PERSONAL QUESTIONS
  // --------------------------
  sportAndExperience:
    "What sport do you participate in and how long have you been training/competing in it?",
  currentTrainingRegime:
    "What is your current training regimen (frequency, duration, type of exercises)?",
  // --------------------------
  // ASSESSMENT QUESTIONS
  // --------------------------
  rating:
    "How would you rate your current effort in training and competition on a scale of 1 to 10?",
  satisfaction:
    "What specific areas of your effort are you most satisfied with?",
  areasForImprovement:
    "What specific areas of your effort do you feel need improvement?",
  goals:
    "What are your short-term (next 3-6 months) and long-term (next 1-3 years) effort-related goals?",
  moodAndMindsetRating:
    "How would you rate your overall mentality and approach to life when things don't go as planned, on a scale of 1 to 10?",
  sourcesOfStress:
    "What are the main things in your life that distract you from being the best version of yourself?",
  motivationalFactors: "What motivates you to train and compete in your sport?",
  handlingFailure: "How do you handle failure or setbacks?",
  physicalHealthRating:
    "How would you rate your overall physical health on a scale of 1 to 10?",
  injuriesAndHealthIssues:
    "Are you currently dealing with any injuries or health issues?",
  sleepQuality:
    "How many hours of sleep do you get on average per night and how would you rate its quality on a scale of 1 to 10?",
  dietAndNutrition:
    "What is your current diet like? Are there any specific nutritional plans you follow?",
  balancingTrainingAndRest:
    "How do you balance your training with rest and recovery?",
  trackingMethods:
    "How do you currently track your training and effort progress?",
  toolsAndApps:
    "Do you use any specific tools or apps to monitor your performance?",
  reviewAndAdjustment: "How often do you review and adjust your training plan?",
  teamRole: "What leadership roles do you take on within your team?",
  supportAndMotivation: "How do you support and motivate your teammates?",
  adaptationToTrainingMethods:
    "How quickly do you adapt to new training methods or techniques?",
  experimentalApproaches:
    "How often do you try new training methods or techniques?",
  evaluatingEffectiveness:
    "How do you evaluate the effectiveness of these new approaches?",
  goalsAchieved: "What significant goals have you achieved so far?",
  progressMilestones:
    "What milestones have you reached in your athletic journey?",
  selfAwareness:
    "How often do you think about your temperament during training or competitions?",
  impactOnPerformance:
    "Can you describe a time when your temperament helped or hurt your performance?",
  copingStrategies:
    "Do you have any tricks or methods that elevate your game while in competition?",
  adjustmentsMade:
    "What adjustments have you made to your training plan over time?",
  biggestStrengths: "What are your biggest strengths as an athlete?",
  biggestChallenges:
    "What are the biggest challenges you face in your athletic journey?",
  additionalSupport:
    "Is there anything else you’d like to share about your athletic experience or any additional support you need to reach your goals?",
  personalLifeBalance:
    "How do you prioritize your personal life and well-being alongside your training?",
  activitiesOutsideTraining:
    "What activities outside of training contribute to your overall happiness and well-being?",
};

export const ATHLETE_QUESTIONS: IAthleteFormQuestion[] = [
  {
    key: "sportAndExperience",
    question: ATHLETE_FORM_QUESTION["sportAndExperience"],
    section: "personal",
  },
  {
    key: "currentTrainingRegime",
    question: ATHLETE_FORM_QUESTION["currentTrainingRegime"],
    section: "personal",
  },
  {
    key: "rating",
    question: ATHLETE_FORM_QUESTION["rating"],
    section: "effort",
  },
  {
    key: "satisfaction",
    question: ATHLETE_FORM_QUESTION["satisfaction"],
    section: "effort",
  },
  {
    key: "areasForImprovement",
    question: ATHLETE_FORM_QUESTION["areasForImprovement"],
    section: "effort",
  },
  {
    key: "goals",
    question: ATHLETE_FORM_QUESTION["goals"],
    section: "goals",
  },
  {
    key: "moodAndMindsetRating",
    question: ATHLETE_FORM_QUESTION["moodAndMindsetRating"],
    section: "mental",
  },
  {
    key: "sourcesOfStress",
    question: ATHLETE_FORM_QUESTION["sourcesOfStress"],
    section: "mental",
  },
  {
    key: "motivationalFactors",
    question: ATHLETE_FORM_QUESTION["motivationalFactors"],
    section: "mental",
  },
  {
    key: "handlingFailure",
    question: ATHLETE_FORM_QUESTION["handlingFailure"],
    section: "mental",
  },
  {
    key: "physicalHealthRating",
    question: ATHLETE_FORM_QUESTION["physicalHealthRating"],
    section: "physical",
  },
  {
    key: "injuriesAndHealthIssues",
    question: ATHLETE_FORM_QUESTION["injuriesAndHealthIssues"],
    section: "physical",
  },
  {
    key: "sleepQuality",
    question: ATHLETE_FORM_QUESTION["sleepQuality"],
    section: "physical",
  },
  {
    key: "dietAndNutrition",
    question: ATHLETE_FORM_QUESTION["dietAndNutrition"],
    section: "physical",
  },
  {
    key: "balancingTrainingAndRest",
    question: ATHLETE_FORM_QUESTION["balancingTrainingAndRest"],
    section: "physical",
  },
  {
    key: "trackingMethods",
    question: ATHLETE_FORM_QUESTION["trackingMethods"],
    section: "progress",
  },
  {
    key: "toolsAndApps",
    question: ATHLETE_FORM_QUESTION["toolsAndApps"],
    section: "progress",
  },
  {
    key: "reviewAndAdjustment",
    question: ATHLETE_FORM_QUESTION["reviewAndAdjustment"],
    section: "progress",
  },
  {
    key: "teamRole",
    question: ATHLETE_FORM_QUESTION["teamRole"],
    section: "goals",
  },
  {
    key: "supportAndMotivation",
    question: ATHLETE_FORM_QUESTION["supportAndMotivation"],
    section: "goals",
  },
  {
    key: "adaptationToTrainingMethods",
    question: ATHLETE_FORM_QUESTION["adaptationToTrainingMethods"],
    section: "goals",
  },
  {
    key: "experimentalApproaches",
    question: ATHLETE_FORM_QUESTION["experimentalApproaches"],
    section: "goals",
  },
  {
    key: "evaluatingEffectiveness",
    question: ATHLETE_FORM_QUESTION["evaluatingEffectiveness"],
    section: "goals",
  },
  {
    key: "goalsAchieved",
    question: ATHLETE_FORM_QUESTION["goalsAchieved"],
    section: "goals",
  },
  {
    key: "progressMilestones",
    question: ATHLETE_FORM_QUESTION["progressMilestones"],
    section: "goals",
  },
  {
    key: "selfAwareness",
    question: ATHLETE_FORM_QUESTION["selfAwareness"],
    section: "emotional",
  },
  {
    key: "impactOnPerformance",
    question: ATHLETE_FORM_QUESTION["impactOnPerformance"],
    section: "emotional",
  },
  {
    key: "copingStrategies",
    question: ATHLETE_FORM_QUESTION["copingStrategies"],
    section: "emotional",
  },
  {
    key: "adjustmentsMade",
    question: ATHLETE_FORM_QUESTION["adjustmentsMade"],
    section: "others",
  },
  {
    key: "biggestStrengths",
    question: ATHLETE_FORM_QUESTION["biggestStrengths"],
    section: "others",
  },
  {
    key: "biggestChallenges",
    question: ATHLETE_FORM_QUESTION["biggestChallenges"],
    section: "others",
  },
  {
    key: "additionalSupport",
    question: ATHLETE_FORM_QUESTION["additionalSupport"],
    section: "others",
  },
  {
    key: "personalLifeBalance",
    question: ATHLETE_FORM_QUESTION["personalLifeBalance"],
    section: "others",
  },
  {
    key: "activitiesOutsideTraining",
    question: ATHLETE_FORM_QUESTION["activitiesOutsideTraining"],
    section: "others",
  },
];
