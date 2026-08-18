export type DocumentCategory =
  | "budget"
  | "coa_audit"
  | "full_disclosure"
  | "procurement"
  | "citizens_charter"
  | "other";

export interface TransparencyDocument {
  id: number;
  title: string;
  category: DocumentCategory;
  year: number | null;
  source_url: string | null;
  file_url: string | null;
  description: string | null;
  created_at: string;
}

export type ProjectStatus = "planned" | "ongoing" | "completed" | "unknown";

export type FundingSource =
  | "BUB"
  | "LGSF"
  | "ADM"
  | "AM"
  | "local"
  | "national"
  | "other";

export interface GovernmentProject {
  id: number;
  title: string;
  barangay: string | null;
  amount: number | null;
  funding_source: FundingSource | null;
  year: number | null;
  status: ProjectStatus;
  description: string | null;
  created_at: string;
}
