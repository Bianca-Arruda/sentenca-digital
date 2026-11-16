export type WindowId =
  | "dashboard"
  | "finalDashboard"
  | "cases"
  | "map"
  | "achievements"
  | "archive"
  | "settings"
  | "computer"
  | "caseFile"
  | "decision"
  | "realCase"
  | "readme"
  | "trash";

export type WindowState = {
  id: WindowId;
  title: string;
  icon: string;
  zIndex: number;
  minimized: boolean;
  x?: number;
  y?: number;
};

export type DesktopIconData = {
  id: WindowId;
  label: string;
  icon: string;
};

export type SocietyMetrics = {
  responsibility: number;
  adoption: number;
  trust: number;
};

export type CaseSummary = {
  id: string;
  title: string;
  country: string;
  year: number;
  status: "in-progress" | "available" | "locked";
};
