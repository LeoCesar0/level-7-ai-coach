import { z } from "zod";

export type IAssessmentKey = z.infer<typeof zAssessmentKey>;
export type IAssessmentSection = z.infer<typeof zAssessmentSection>;

export const zAssessmentSection = z.enum([
  "effort",
  "mental",
  "emotional",
  "physical",
  "goals",
  "progress",
  "others",
]);

export const zAssessmentKey = z.enum([
  // --------------------------
  // Effort
  // --------------------------
  "rating",
  "satisfaction",
  "areasForImprovement",
  "goals",
  // --------------------------
  // Mental
  // --------------------------
  "moodAndMindsetRating",
  "sourcesOfStress",
  "motivationalFactors",
  "handlingFailure",
  // --------------------------
  // Physical
  // --------------------------
  "physicalHealthRating",
  "injuriesAndHealthIssues",
  "sleepQuality",
  "dietAndNutrition",
  "balancingTrainingAndRest",
  // --------------------------
  // Progress
  // --------------------------
  "trackingMethods",
  "toolsAndApps",
  "reviewAndAdjustment",
  // --------------------------
  // Goals
  // --------------------------
  "teamRole",
  "supportAndMotivation",
  "adaptationToTrainingMethods",
  "experimentalApproaches",
  "evaluatingEffectiveness",
  "goalsAchieved",
  "progressMilestones",
  // --------------------------
  // Emotional
  // --------------------------
  "selfAwareness",
  "impactOnPerformance",
  "copingStrategies",
  // --------------------------
  // Others
  // --------------------------
  "adjustmentsMade",
  "biggestStrengths",
  "biggestChallenges",
  "additionalSupport",
  "personalLifeBalance",
  "activitiesOutsideTraining",
]);

export const ASSESSMENT_TOPIC: Record<IAssessmentKey, string> = {
  rating: "Athlete's self-assessment",
  satisfaction: "Agent's assessment based on athlete's responses",
  areasForImprovement: "Agent's assessment based on athlete's responses",
  goals: "Realism and clarity of goals",
  moodAndMindsetRating: "Athlete's self-assessment",
  sourcesOfStress: "Severity and manageability",
  motivationalFactors: "Strength and diversity of motivators",
  handlingFailure: "Effectiveness of strategies",
  physicalHealthRating: "Athlete's self-assessment",
  injuriesAndHealthIssues: "Severity and impact",
  sleepQuality: "Athlete's self-assessment",
  dietAndNutrition: "Balance and suitability",
  balancingTrainingAndRest: "Effectiveness of balance",
  trackingMethods: "Completeness and effectiveness",
  toolsAndApps: "Utilization and suitability",
  reviewAndAdjustment: "Frequency and effectiveness",
  teamRole: "Level of involvement and effectiveness",
  supportAndMotivation: "Effectiveness and consistency",
  adaptationToTrainingMethods: "Speed and effectiveness",
  experimentalApproaches: "Frequency and success",
  evaluatingEffectiveness: "Thoroughness and accuracy",
  goalsAchieved: "Number and significance",
  progressMilestones: "Number and significance",
  selfAwareness: "Depth of insight",
  impactOnPerformance: "Positive or negative impact",
  copingStrategies: "Effectiveness and appropriateness",
  adjustmentsMade: "Frequency and effectiveness",
  biggestStrengths: "Insightfulness and accuracy",
  biggestChallenges: "Insightfulness and accuracy",
  additionalSupport: "Completeness and relevance",
  personalLifeBalance: "Effectiveness and sustainability",
  activitiesOutsideTraining: "Diversity and impact on well-being",
};

export const getAssessmentTopicsText = () => {
  const text = Object.entries(ASSESSMENT_TOPIC)
    .map(([key, value]) => {
      return `${key}: ${value}`;
    })
    .join("\n");
  const explanation = `Here is a brief explanation of each topic you should evaluate the athlete\n'''${text}'''`;
  return {
    text,
    explanation,
  };
};
