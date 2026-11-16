import { apiRequest } from '@/lib/api';
import type { CaseResponse, CasesResponse } from '@/types/case';

export async function listCases(): Promise<CasesResponse> {
  return apiRequest<CasesResponse>('/cases');
}

export async function getCase(identifier: string): Promise<CaseResponse> {
  return apiRequest<CaseResponse>(`/cases/${encodeURIComponent(identifier)}`);
}
