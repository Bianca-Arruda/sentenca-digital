import type { SocietyMetrics } from '@/types/game';

export type CareerState = {
  code: 'NOVICE' | 'ANALYST' | 'JUDGE' | 'SENIOR' | 'MASTER';
  title: string;
  nextPercent: number | null;
};

export type PlayerEvent = {
  id: string;
  type: 'CASE_STARTED' | 'DECISAO_REGISTRADA' | 'CASE_UNLOCKED' | 'MILESTONE' | 'ACHIEVEMENT_UNLOCKED';
  title: string;
  message: string;
  createdAt: string;
  case?: { code: string } | null;
};

export type ProgressState = {
  currentCaseOrder: number;
  completedCases: number;
  discoveredCases: number;
  progressPercent: number;
  totalCases: number;
  career: CareerState;
  nextCase: { code: string; title: string; order: number } | null;
  societyMetrics: SocietyMetrics;
  events: PlayerEvent[];
  statistics: {
    decisionsCount: number;
    discoveredCountries: number;
    unlockedAchievements: number;
    totalAchievements: number;
  };
};

export type ProgressResponse = {
  data: ProgressState;
};
