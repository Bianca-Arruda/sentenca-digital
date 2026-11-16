import { apiRequest } from '@/lib/api';
import type { MapResponse } from '@/types/map';

export function getMap(): Promise<MapResponse> {
  return apiRequest<MapResponse>('/map');
}
