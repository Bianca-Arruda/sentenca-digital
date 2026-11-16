export type DecisionMetrics = {
  responsibility: number;
  adoption: number;
  trust: number;
};

export type DecisionMetricChanges = {
  responsibility: number;
  adoption: number;
  trust: number;
};

export type DecisionResult = {
  case: {
    code: string;
    title: string;
    order: number;
  };
  decision: {
    optionId: string;
    title: string;
  };
  metrics: DecisionMetrics;
  metricChanges: DecisionMetricChanges;
  progress: {
    currentCaseOrder: number;
    completedCases: number;
    discoveredCases: number;
    progressPercent: number;
  };
  realCase: {
    outcome: string;
    sourceUrl: string | null;
    sourceTitle: string | null;
  };
  nextCase: {
    code: string;
    title: string;
    order: number;
  } | null;
  unlockedAchievements: unknown[];
};

export type DecisionResponse = {
  data: DecisionResult;
};

/**
 * Tipos legados de conteúdo estático.
 * Não representam os indicadores do backend nem devem ser usados
 * para registrar decisões no fluxo atual do jogo.
 */
export type DecisionOption = {
  id: string;
  title: string;
  description: string;
  consequence: string;
  scoreChanges: {
    societyProtection: number;
    innovationFreedom: number;
    justiceTrust: number;
  };
  newsHeadline: string;
};

export type RealOutcome = {
  title: string;
  summary: string;
  lesson: string;
  sourceLabel: string;
  sourceUrl?: string;
};

export type CaseDecisionContent = {
  caseId: string;
  challenge: string;
  decisions: DecisionOption[];
  realOutcome: RealOutcome;
};