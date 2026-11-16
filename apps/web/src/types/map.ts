export type MapCaseAccessStatus = 'LOCKED' | 'AVAILABLE' | 'IN_PROGRESS' | 'COMPLETED';

export type MapCountry = {
  country: string;
  countryCode: string;
  caseCount: number;
  completedCases: number;
  discoveredCases: number;
  unlocked: boolean;
};

export type MapCase = {
  id: string;
  code: string;
  title: string;
  country: string;
  countryCode: string;
  year: number;
  latitude: number | string | null;
  longitude: number | string | null;
  order: number;
  accessStatus: MapCaseAccessStatus;
};

export type MapProgress = {
  currentCaseOrder: number;
  completedCases: number;
  discoveredCases: number;
  progressPercent: number;
};

export type MapData = {
  progress: MapProgress;
  totalCases: number;
  totalCountries: number;
  countries: MapCountry[];
  cases: MapCase[];
};

export type MapResponse = {
  data: MapData;
};
