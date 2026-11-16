export type Achievement = {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string | null;
  unlocked: boolean;
  unlockedAt: string | null;
};

export type AchievementResponse = {
  data: Achievement[];
};
