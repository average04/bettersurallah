export type OfficialGroup =
  | "executive"
  | "sangguniang_bayan"
  | "department_head"
  | "barangay_captain";

export interface Official {
  name: string;
  position: string;
  group: OfficialGroup;
  detail?: string;
  phone?: string;
  unverified?: boolean;
}

export const GROUP_LABELS: Record<OfficialGroup, string> = {
  executive: "Executive",
  sangguniang_bayan: "Sangguniang Bayan",
  department_head: "Department Heads & Offices",
  barangay_captain: "Barangay Captains",
};

export const OFFICIALS: Official[] = [
  { name: 'Pedro "Cano" M. Matinong Jr.', position: "Municipal Mayor", group: "executive", phone: "2383-578" },
  { name: "Hon. Harold B. Eslabon", position: "Vice Mayor", group: "executive" },

  { name: "Hon. Beltran L. Armada", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Finance, Budget & Appropriation; Rules; Infrastructure, Housing & Land Use", unverified: true },
  { name: "Hon. Ian Cristopher B. Escleto", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Women, Children & Family; Trade, Investment & Livelihood", unverified: true },
  { name: "Hon. Reynaldo S. Costan", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Justice & Human Rights", unverified: true },
  { name: "Hon. Filipina D. Peñol", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Youth & Sports Development", unverified: true },
  { name: "Hon. Chris P. Valdevieso", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Agriculture & Environment; Tourism, Culture & Arts; Transportation", unverified: true },
  { name: "Hon. Resuli O. Villanueva", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Police & Drug-Related Matters; Health, Sanitation & Nutrition", unverified: true },
  { name: "Hon. Floyd Ross D. Rosal", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Social Services; Education; Games & Amusements", unverified: true },
  { name: "Hon. Romulo B. Solivio Jr.", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Communication & Energy", unverified: true },
  { name: "Hon. Ronald F. Talfan", position: "SB Member", group: "sangguniang_bayan", detail: "Chair: Cultural Minority", unverified: true },
  { name: "Hon. Renato B. Susbilla", position: "SB Member (Liga ng mga Barangay President)", group: "sangguniang_bayan", detail: "Chair: Barangay Affairs", unverified: true },

  { name: "Benjamin S. Datinguinoo", position: "Municipal Administrator", group: "department_head", phone: "2383-578" },
  { name: "Dionel C. Calibayan", position: "Chief of Staff, Office of the Mayor", group: "department_head" },
  { name: "Josephine C. Portogalete", position: "Municipal Agriculturist", group: "department_head", phone: "2383-496" },
  { name: "Elisa M. Alferes", position: "SB Secretary", group: "department_head", phone: "2385-046" },
  { name: "Jesus B. Cariño", position: "Municipal Human Resource Management Officer", group: "department_head", phone: "2383-592" },
  { name: "Joyce A. Lubaton", position: "Municipal Planning & Development Coordinator", group: "department_head", phone: "2383-759" },
  { name: "Engr. Gemma J. Burgos", position: "Municipal Civil Registrar", group: "department_head", phone: "2383-981" },
  { name: "Ely T. Todoc", position: "Municipal Budget Officer", group: "department_head", phone: "2383-100" },
  { name: "Aida B. Baylas, CPA", position: "Municipal Accountant", group: "department_head", phone: "2383-328" },
  { name: "Edward B. Barrios", position: "Municipal Treasurer", group: "department_head", phone: "2383-483" },
  { name: "Leonardo B. Ballon, EnP", position: "MDRRM Officer", group: "department_head", phone: "2383-911" },
  { name: "Dr. Neil T. Crespo", position: "Municipal Health Officer", group: "department_head", phone: "2383-485" },
  { name: "Engr. Roldan M. Eusoya", position: "MENR Officer", group: "department_head", phone: "2383-983" },
  { name: "Andrew Ian B. Dormitorio", position: "MEEMO Manager", group: "department_head", phone: "2383-033" },
  { name: "Leonardo A. Mondejar", position: "Municipal Assessor", group: "department_head", phone: "2383-414" },
  { name: "Engr. Lerny D. Pajonar, EnP", position: "Municipal Engineer", group: "department_head", phone: "2383-583" },
  { name: "Marietta C. Discaya", position: "BAC Secretariat Head", group: "department_head", phone: "2383-262" },
  { name: "Rhoda Leaf G. Catoto, RSW", position: "MSWD Officer", group: "department_head", phone: "2383-009" },
  { name: "Arnold B. Sequito", position: "Business & Licensing Officer", group: "department_head", phone: "2383-925" },
  { name: "Mary Grace C. Cabaya", position: "Management Audit Analyst III", group: "department_head" },
  { name: "Cherish Love M. Eslabon", position: "PESO Manager", group: "department_head", phone: "2383-107" },
  { name: "Maylyn P. Diesto", position: "Senior Tourism Operations Officer", group: "department_head", phone: "2383-997" },
  { name: "Kristine B. Tanucan", position: "Community Development Information Officer", group: "department_head", phone: "2383-143" },
  { name: "Remelyn E. Cataloctocan", position: "Acting General Services Officer", group: "department_head", phone: "2383-715" },

  { name: "Haddy S. Glamado", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Buenavista" },
  { name: "Rita P. Escorido", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Canahay" },
  { name: "Oscar B. Bubongan", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Centrala" },
  { name: "Rizalito L. Ello Jr.", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Colongulo" },
  { name: "Christopher B. Lazo", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Dajay" },
  { name: "Vilma B. Herbilla", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Duengas" },
  { name: "Letecia A. Pedroso", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lambontong" },
  { name: "Rolly Marmito", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lamian" },
  { name: "Anthony B. Baladjay", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Lamsugod" },
  { name: "Renato B. Susbilla", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Libertad" },
  { name: "Dionel C. Calibayan", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Little Baguio" },
  { name: "Efraem E. Fulgencio", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Moloy" },
  { name: "Angelo P. Casas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Naci" },
  { name: "Arnold L. Buriel", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Talahik" },
  { name: "Bertito P. Allas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Tubi-Alah" },
  { name: "Edon P. Ambas", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Upper Sepaka" },
  { name: "Anita M. Fernando", position: "Punong Barangay", group: "barangay_captain", detail: "Brgy. Veterans" },
];
