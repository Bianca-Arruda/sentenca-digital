
export type CaseKind =
  | 'JUDICIAL'
  | 'REGULATORY'
  | 'CORPORATE_INCIDENT';

export type EvidenceType =
  | 'DOCUMENT'
  | 'CONVERSATION'
  | 'POLICY'
  | 'RECORD'
  | 'IMAGE'
  | 'REPORT'
  | 'OTHER';

export type EvidenceViewer =
  | 'DOCUMENT'
  | 'EMAIL'
  | 'TERMINAL'
  | 'BROWSER'
  | 'IMAGE'
  | 'GENERIC';

export type EvidenceMetadata = {
  institution?: string;
  documentLabel?: string;
  processNumber?: string;
  status?: string;
  sender?: string;
  recipient?: string;
  date?: string;
  sourceLabel?: string;
  isFictional?: boolean;
};

export type CaseAccessStatus =
  | 'LOCKED'
  | 'AVAILABLE'
  | 'IN_PROGRESS'
  | 'COMPLETED';

export type CaseEvidence = {
  id: string;
  title: string;
  description: string;
  type: EvidenceType;
  content: string;
  hiddenClue?: string | null;
  fileUrl?: string | null;
  sortOrder: number;

  viewer?: EvidenceViewer;
  metadata?: EvidenceMetadata | null;
  mimeType?: string | null;
  fileName?: string | null;
};

export type DecisionOption = {
  id: string;
  title: string;
  description: string;
  sortOrder: number;
};

export type CaseSummary = {
  id: string;
  code: string;
  title: string;
  description: string;
  country: string;
  countryCode: string;
  year: number;
  category: string;
  kind: CaseKind;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  order: number;
  accessStatus: CaseAccessStatus;
};

export type CaseDetail = CaseSummary & {
  context: string;
  guideMessage: string;
  decisionQuestion: string;
  playerStatus: 'IN_PROGRESS' | 'COMPLETED';
  evidence: CaseEvidence[];
  decisionOptions: DecisionOption[];
};

export type CasesResponse = {
  data: CaseSummary[];
};

export type CaseResponse = {
  data: CaseDetail;
};
