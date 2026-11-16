import { apiRequest } from '@/lib/api';
import type { ProgressResponse } from '@/types/progress';

export function getProgress(): Promise<ProgressResponse> {
  return apiRequest<ProgressResponse>('/progress');
}
