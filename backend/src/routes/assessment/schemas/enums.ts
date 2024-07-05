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
  "effort_rating",
  "effort_satisfaction",
  "effort_areasForImprovement",
  "effort_goals",
  "mental_moodAndMindsetRating",
  "mental_sourcesOfStress",
  "mental_motivationalFactors",
  "mental_handlingFailure",
  "physical_physicalHealthRating",
  "physical_injuriesAndHealthIssues",
  "physical_sleepQuality",
  "physical_dietAndNutrition",
  "physical_balancingTrainingAndRest",
  "progress_trackingMethods",
  "progress_toolsAndApps",
  "progress_reviewAndAdjustment",
  "goals_teamRole",
  "goals_supportAndMotivation",
  "goals_adaptationToTrainingMethods",
  "goals_experimentalApproaches",
  "goals_evaluatingEffectiveness",
  "goals_goalsAchieved",
  "goals_progressMilestones",
  "emotional_selfAwareness",
  "emotional_impactOnPerformance",
  "emotional_copingStrategies",
  "others_adjustmentsMade",
  "others_biggestStrengths",
  "others_biggestChallenges",
  "others_additionalSupport",
  "others_personalLifeBalance",
  "others_activitiesOutsideTraining",
]);

export const ASSESSMENT_QUESTION: Record<IAssessmentKey, string> = {
  effort_rating:
    "How would you rate your current effort in training and competition on a scale of 1 to 10?",
  effort_satisfaction:
    "What specific areas of your effort are you most satisfied with?",
  effort_areasForImprovement:
    "What specific areas of your effort do you feel need improvement?",
  effort_goals:
    "What are your short-term (next 3-6 months) and long-term (next 1-3 years) effort-related goals?",
  mental_moodAndMindsetRating:
    "How would you rate your overall mentality and approach to life when things don't go as planned, on a scale of 1 to 10?",
  mental_sourcesOfStress:
    "What are the main things in your life that distract you from being the best version of yourself?",
  mental_motivationalFactors:
    "What motivates you to train and compete in your sport?",
  mental_handlingFailure: "How do you handle failure or setbacks?",
  physical_physicalHealthRating:
    "How would you rate your overall physical health on a scale of 1 to 10?",
  physical_injuriesAndHealthIssues:
    "Are you currently dealing with any injuries or health issues?",
  physical_sleepQuality:
    "How many hours of sleep do you get on average per night and how would you rate its quality on a scale of 1 to 10?",
  physical_dietAndNutrition:
    "What is your current diet like? Are there any specific nutritional plans you follow?",
  physical_balancingTrainingAndRest:
    "How do you balance your training with rest and recovery?",
  progress_trackingMethods:
    "How do you currently track your training and effort progress?",
  progress_toolsAndApps:
    "Do you use any specific tools or apps to monitor your performance?",
  progress_reviewAndAdjustment:
    "How often do you review and adjust your training plan?",
  goals_teamRole: "What leadership roles do you take on within your team?",
  goals_supportAndMotivation: "How do you support and motivate your teammates?",
  goals_adaptationToTrainingMethods:
    "How quickly do you adapt to new training methods or techniques?",
  goals_experimentalApproaches:
    "How often do you try new training methods or techniques?",
  goals_evaluatingEffectiveness:
    "How do you evaluate the effectiveness of these new approaches?",
  goals_goalsAchieved: "What significant goals have you achieved so far?",
  goals_progressMilestones:
    "What milestones have you reached in your athletic journey?",
  emotional_selfAwareness:
    "How often do you think about your temperament during training or competitions?",
  emotional_impactOnPerformance:
    "Can you describe a time when your temperament helped or hurt your performance?",
  emotional_copingStrategies:
    "Do you have any tricks or methods that elevate your game while in competition?",
  others_adjustmentsMade:
    "What adjustments have you made to your training plan over time?",
  others_biggestStrengths: "What are your biggest strengths as an athlete?",
  others_biggestChallenges:
    "What are the biggest challenges you face in your athletic journey?",
  others_additionalSupport:
    "Is there anything else you’d like to share about your athletic experience or any additional support you need to reach your goals?",
  others_personalLifeBalance:
    "How do you prioritize your personal life and well-being alongside your training?",
  others_activitiesOutsideTraining:
    "What activities outside of training contribute to your overall happiness and well-being?",
};

export const ASSESSMENT_TOPIC: Record<IAssessmentKey, string> = {
  effort_rating: "Athlete's self-assessment",
  effort_satisfaction: "Agent's assessment based on athlete's responses",
  effort_areasForImprovement: "Agent's assessment based on athlete's responses",
  effort_goals: "Realism and clarity of goals",
  mental_moodAndMindsetRating: "Athlete's self-assessment",
  mental_sourcesOfStress: "Severity and manageability",
  mental_motivationalFactors: "Strength and diversity of motivators",
  mental_handlingFailure: "Effectiveness of strategies",
  physical_physicalHealthRating: "Athlete's self-assessment",
  physical_injuriesAndHealthIssues: "Severity and impact",
  physical_sleepQuality: "Athlete's self-assessment",
  physical_dietAndNutrition: "Balance and suitability",
  physical_balancingTrainingAndRest: "Effectiveness of balance",
  progress_trackingMethods: "Completeness and effectiveness",
  progress_toolsAndApps: "Utilization and suitability",
  progress_reviewAndAdjustment: "Frequency and effectiveness",
  goals_teamRole: "Level of involvement and effectiveness",
  goals_supportAndMotivation: "Effectiveness and consistency",
  goals_adaptationToTrainingMethods: "Speed and effectiveness",
  goals_experimentalApproaches: "Frequency and success",
  goals_evaluatingEffectiveness: "Thoroughness and accuracy",
  goals_goalsAchieved: "Number and significance",
  goals_progressMilestones: "Number and significance",
  emotional_selfAwareness: "Depth of insight",
  emotional_impactOnPerformance: "Positive or negative impact",
  emotional_copingStrategies: "Effectiveness and appropriateness",
  others_adjustmentsMade: "Frequency and effectiveness",
  others_biggestStrengths: "Insightfulness and accuracy",
  others_biggestChallenges: "Insightfulness and accuracy",
  others_additionalSupport: "Completeness and relevance",
  others_personalLifeBalance: "Effectiveness and sustainability",
  others_activitiesOutsideTraining: "Diversity and impact on well-being",
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
