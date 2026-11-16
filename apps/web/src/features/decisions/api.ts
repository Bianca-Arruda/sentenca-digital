import { apiRequest } from '@/lib/api';
import type { DecisionResponse } from '@/types/decision';

export function registerDecision(caseIdentifier: string, decisionOptionId: string): Promise<DecisionResponse> {
  return apiRequest<DecisionResponse>(`/cases/${encodeURIComponent(caseIdentifier)}/decision`, {
    method: 'POST',
    body: JSON.stringify({ decisionOptionId }),
  });
}
