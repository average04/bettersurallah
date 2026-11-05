import raw from "./services.json";

// Government services transcribed from the LGU Surallah Citizen's Charter 2026 (1st edition).
// services.json was extracted from the PDF and checked by hand against it; `page` is the
// PDF page where each service starts.

export const CHARTER = {
  title: "LGU Surallah Citizen's Charter 2026 (1st edition)",
  url: "https://surallah.gov.ph/wp-content/uploads/2026/03/LGU-Surallah-Citizens-charter-2026-1st-edition_compressed.pdf",
  sourcePage: "https://surallah.gov.ph/citizens-charter/",
  feeSchedulePages: [108, 125] as const,
};

export type OfficeKey =
  | "bplo" | "mao" | "masso" | "mcro" | "mdrrmo" | "ome" | "meemo" | "menro" | "mgso"
  | "mho" | "mhro" | "mpdo" | "mswdo" | "mto" | "peso" | "sb" | "tourism";

export interface Office {
  key: OfficeKey;
  name: string;
  short: string;
  /** Plain-language label for what people go there for. */
  topic: string;
  address: string;
  phone?: string;
}

const TOWN_HALL = "Allah Valley Drive, Surallah, South Cotabato";
const TERMINAL = "Surallah Public Terminal, Surallah, South Cotabato";
const LIBERTAD = "Brgy. Libertad, Surallah, South Cotabato";

// Addresses and phone numbers are from the charter's contact list (page 232).
export const OFFICES: Office[] = [
  { key: "mcro", name: "Municipal Civil Registrar's Office", short: "MCRO", topic: "Birth, marriage & death records", address: TOWN_HALL, phone: "(083) 238-3981" },
  { key: "bplo", name: "Business Permits and Licensing Office", short: "BPLO", topic: "Business & tricycle permits", address: TOWN_HALL, phone: "(083) 238-3925" },
  { key: "mto", name: "Municipal Treasurer's Office", short: "MTO", topic: "Taxes, cedula & payments", address: TOWN_HALL, phone: "(083) 552-6254" },
  { key: "mswdo", name: "Municipal Social Welfare and Development Office", short: "MSWDO", topic: "IDs, aid & social welfare", address: LIBERTAD, phone: "(083) 238-3739" },
  { key: "mho", name: "Municipal Health Office", short: "MHO", topic: "Health services & permits", address: LIBERTAD, phone: "(083) 238-3485" },
  { key: "masso", name: "Municipal Assessor's Office", short: "MASSO", topic: "Property & tax declarations", address: TOWN_HALL, phone: "(083) 238-3414" },
  { key: "ome", name: "Office of the Municipal Engineer & Building Official", short: "MEBO", topic: "Building & electrical permits", address: TOWN_HALL },
  { key: "mpdo", name: "Municipal Planning and Development Office", short: "MPDO", topic: "Zoning & land use", address: TOWN_HALL, phone: "(083) 238-3579" },
  { key: "peso", name: "Public Employment Service Office", short: "PESO", topic: "Jobs, OFWs & training", address: TOWN_HALL },
  { key: "mao", name: "Municipal Agriculture Office", short: "MAO", topic: "Farming & livestock", address: TERMINAL, phone: "(083) 238-3496" },
  { key: "menro", name: "Municipal Environment and Natural Resources Office", short: "MENRO", topic: "Environment, trees & garbage", address: TOWN_HALL, phone: "(083) 238-3983" },
  { key: "meemo", name: "Municipal Economic Enterprise Management Office", short: "MEEMO", topic: "Market, terminal & cemetery", address: TERMINAL, phone: "(083) 238-3033" },
  { key: "mdrrmo", name: "Municipal Disaster Risk Reduction and Management Office", short: "MDRRMO", topic: "Emergencies & disaster help", address: TOWN_HALL, phone: "(083) 238-3911" },
  { key: "sb", name: "Sangguniang Bayan Legislative Office", short: "SB", topic: "Ordinances & resolutions", address: "New SB Bldg., Allah Valley Drive, Surallah, South Cotabato", phone: "(083) 238-5046" },
  { key: "tourism", name: "Surallah Tourism, Arts & Culture Development Center", short: "Tourism", topic: "Tourism & public facilities", address: TOWN_HALL, phone: "(083) 238-3997" },
  { key: "mgso", name: "Municipal General Services Office", short: "GSO", topic: "Borrowing equipment & repairs", address: TOWN_HALL, phone: "(083) 238-3715" },
  { key: "mhro", name: "Human Resource Management Office", short: "HRMO", topic: "LGU employee records", address: TOWN_HALL, phone: "(083) 238-3592" },
];

export const OFFICE_BY_KEY = Object.fromEntries(OFFICES.map((o) => [o.key, o])) as Record<OfficeKey, Office>;

/** From the charter's "Feedback and Complaints Mechanism" (page 231). */
export const FEEDBACK = {
  office: "Municipal Internal Audit Service Office (MIASO)",
  phone: "(083) 238-3618",
  email: "miaso.surallah@gmail.com",
  page: 231,
};

export type Classification = "Simple" | "Complex" | "Highly technical" | "Simple, complex or highly technical";

export interface RequirementItem {
  item: string;
  where: string | null;
  options?: string[];
}

export interface RequirementGroup {
  label: string | null;
  note: string | null;
  items: RequirementItem[];
}

export interface Step {
  label: string | null;
  /** What the client does. */
  you: string;
  /** What the office does, as sub-actions. */
  office: string[];
  fee: string;
  time: string;
  who: string;
}

export interface Service {
  slug: string;
  office: OfficeKey;
  name: string;
  officialTitle: string;
  aka: string[];
  summary: string;
  classification: Classification;
  transaction: ("G2C" | "G2B" | "G2G")[];
  whoMayAvail: string;
  requirements: RequirementGroup[];
  steps: Step[];
  /** As printed in the charter's TOTAL row; empty when the charter leaves it blank. */
  totalTime: string;
  /** Total fee from the TOTAL row: "None" when stated as none, null when not stated. */
  totalFee: string | null;
  free: boolean;
  notes: string[];
  page: number;
  endPage: number;
}

export const SERVICES = raw as unknown as Service[];

export const SERVICE_BY_SLUG = new Map(SERVICES.map((s) => [s.slug, s]));

/** Shortcuts shown before someone starts searching. */
export const POPULAR_SLUGS = [
  "cedula-community-tax-certificate",
  "business-permit-new-renewal",
  "birth-registration",
  "psa-documents-on-security-paper-cenomar",
  "senior-citizen-id-purchase-booklet",
  "certificate-of-indigency",
  "building-permit",
  "real-property-tax-bill",
];

/** Maximum processing time per classification under RA 11032 (Ease of Doing Business Act). */
export const CLASSIFICATION_HELP: Record<string, string> = {
  Simple: "Under RA 11032 (Ease of Doing Business Act), simple transactions take at most 3 working days.",
  Complex: "Under RA 11032 (Ease of Doing Business Act), complex transactions take at most 7 working days.",
  "Highly technical": "Under RA 11032 (Ease of Doing Business Act), highly technical transactions take at most 20 working days.",
};

export const TRANSACTION_LABELS = {
  G2C: "Government to citizen",
  G2B: "Government to business",
  G2G: "Government to government",
} as const;

export function pdfPageUrl(page: number) {
  return `${CHARTER.url}#page=${page}`;
}
