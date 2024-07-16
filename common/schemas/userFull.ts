export type IUserFull = {
  _id: string;
  name: string;
  email: string;
  active: boolean;
  role: "admin" | "user" | "coach";
  organization: {
    _id: string;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    slug: string;
    users: string[];
    imageUrl?: string | null | undefined;
    __v?: number | null | undefined;
    adminOrganization?: boolean | undefined;
  };
  archetype: {
    _id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    __v?: number | null | undefined;
    slug?: string | undefined;
  };
  createdAt: string;
  updatedAt: string;
  firebaseId: string;
  phone?: string | null | undefined;
  phoneCode?: string | null | undefined;
  imageUrl?: string | null | undefined;
  address?:
    | { city: string; state: string; country: string; address: string }
    | null
    | undefined;
  birthday?: string | null | undefined;
  sport?: string | null | undefined;
  experience?: string | null | undefined;
  athleteInfo?:
    | Partial<
        Record<
          | "rating"
          | "satisfaction"
          | "areasForImprovement"
          | "goals"
          | "moodAndMindsetRating"
          | "sourcesOfStress"
          | "motivationalFactors"
          | "handlingFailure"
          | "physicalHealthRating"
          | "injuriesAndHealthIssues"
          | "sleepQuality"
          | "dietAndNutrition"
          | "balancingTrainingAndRest"
          | "trackingMethods"
          | "toolsAndApps"
          | "reviewAndAdjustment"
          | "teamRole"
          | "supportAndMotivation"
          | "adaptationToTrainingMethods"
          | "experimentalApproaches"
          | "evaluatingEffectiveness"
          | "goalsAchieved"
          | "progressMilestones"
          | "selfAwareness"
          | "impactOnPerformance"
          | "copingStrategies"
          | "adjustmentsMade"
          | "biggestStrengths"
          | "biggestChallenges"
          | "additionalSupport"
          | "personalLifeBalance"
          | "activitiesOutsideTraining",
          {
            section:
              | "goals"
              | "effort"
              | "mental"
              | "emotional"
              | "physical"
              | "progress"
              | "others";
            question: string;
            answer: string | number;
          }
        >
      >
    | null
    | undefined;
  __v?: number | null | undefined;
};
