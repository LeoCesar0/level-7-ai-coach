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

export const ASSESSMENT_QUESTION: Record<IAssessmentKey, string> = {
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
