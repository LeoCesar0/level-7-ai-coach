const questionKeys = ["q_mind_1", "q_mind_2"] as const;
const questionTags = ["Meditation", "Ayurveda"];

export type QuestionKey = (typeof questionKeys)[number];
export type QuestionTag = (typeof questionTags)[number];

type Question = {
  q: string;
  key: QuestionKey;
  tags: QuestionTag[];
};

export const athleteQuestions: Record<QuestionKey, Question> = {
  q_mind_1: {
    q: "Have you ever done a dosha assessment? If so, what is your main dosha?",
    key: "q_mind_1",
    tags: ["Meditation", "Ayurveda"],
  },
  q_mind_2: {
    q: "Do you follow Ayurvedic dietary or lifestyle recommendations? If so, which ones?",
    key: "q_mind_1",
    tags: ["Meditation", "Ayurveda"],
  },
};
