import { apiRequest } from '@/lib/api';
import type { AchievementResponse } from '@/types/achievement';

export function listAchievements(): Promise<AchievementResponse> {
  return apiRequest<AchievementResponse>('/achievements');
}
