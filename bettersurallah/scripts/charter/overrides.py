"""Hand-checked corrections for the 2026 Citizen's Charter parse, keyed by the service's first PDF page.

Every entry here was checked against the PDF layout text. Wording stays as close to the charter as
possible; only obvious typos and broken line-wraps are fixed.
"""

C = "Client"
OSB = "Office of the Sangguniang Barangay"
MTO = "Municipal Treasurer's Office"
MEBO_FORMS = "MEBO (forms); owner/applicant (accomplished forms)"
OWNER = "Owner/applicant"

# page -> list of (group label | None, [(item, where) | (item, where, [options])], note | None)
REQ = {
    11: [
        ("For sole proprietorship", [("Department of Trade and Industry Registration", "Department of Trade and Industry Office (DTI)")], None),
        ("For corporations", [("Securities and Exchange Commission Registration, Constitution and By-Laws, Securities and Exchange Commission Certificate, Special Power of Authority for Representatives", "Securities and Exchange Commission (SEC)")], None),
        ("For cooperatives", [("Cooperative Development Authority Registration", "Cooperative Development Authority (CDA)")], None),
        ("For associations", [
            ("Department of Labor and Employment Registration", "Department of Labor and Employment (DOLE)"),
            ("Community Tax Certificate (Cedula)", "Office of the Sangguniang Barangay or Municipal Treasurer's Office"),
            ("Barangay Clearance", "Office of the Sangguniang Barangay or Municipal Treasurer's Office"),
            ("Zoning Clearance", "Municipal Planning and Development Office"),
            ("Municipal Environment and Natural Resources Office Clearance", "Municipal Environment and Natural Resources Office"),
            ("Sanitary Permit", "Municipal Health Office"),
            ("Market Clearance (for market lessees)", "Municipal Economic Enterprise Management Office"),
            ("Fire Safety Inspection Clearance", "Bureau of Fire Protection"),
        ], None),
    ],
    21: [
        ("Operator", [
            ("Community Tax Certificate (photocopy)", "Barangay"),
            ("Barangay Clearance/Certification", "Barangay"),
            ("Tricycle Operators and Driver's Association Certification", "Route President"),
            ("Land Transportation Office Official Receipt (photocopy)", "Land Transportation Office"),
            ("Insurance Policy (photocopy)", "Insurance Company"),
        ], None),
        ("Driver", [
            ("Professional Driver's License (photocopy)", "Land Transportation Office"),
            ("Community Tax Certificate (photocopy)", "Barangay"),
            ("Barangay Clearance/Certification", "Barangay"),
            ("Medical Certificate", "Health Center"),
        ], None),
    ],
    23: [
        ("Sole ownership", [("Letter of intent signed by the owner/proprietor (3 copies)", C), ("BIN plate", C)], None),
        ("Corporation, cooperative & association", [
            ("Board Resolution or Secretary's Certificate", C), ("Minutes of the meeting", C),
            ("Original Business Permit (latest)", C), ("BIN plate", C)], None),
    ],
    25: [
        ("For sole proprietorship", [("Community Tax Certificate (Cedula)", "Barangay"), ("Department of Trade and Industry Registration", "Department of Trade and Industry Office (DTI)")], None),
        ("For corporations", [("Community Tax Certificate (Cedula)", MTO), ("Securities and Exchange Commission Registration, Constitution and By-Laws, Securities and Exchange Commission Certificate, Special Power of Authority for Representatives", "Securities and Exchange Commission (SEC)")], None),
        ("For cooperatives", [("Community Tax Certificate (Cedula)", MTO), ("Cooperative Development Authority Registration", "Cooperative Development Authority (CDA)")], None),
        ("For associations", [("Community Tax Certificate (Cedula)", MTO), ("Department of Labor and Employment Registration", "Department of Labor and Employment (DOLE)")], None),
    ],
    28: [("Local and foreign production companies", [
        ("Barangay Clearance", OSB), ("Application Form", "Business Permit and Licensing Office"),
        ("Synopsis of the Film", C), ("Treatment", C), ("Portion of Final Script", C),
        ("Lessor Permit/Lease Contract (for private places)", "Owner of Private Place")], None)],
    31: [(None, [("Community Tax Certificate", C), ("Certificate of Large Cattle", C), ("Veterinary Health Certificate", C)], None)],
    32: [(None, [("Community Tax Certificate", C), ("Certificate of Large Cattle (optional)", C), ("Veterinary Health Certificate", "MAO")], None)],
    34: [(None, [("Community Tax Certificate", C), ("Valid ID", C)], None)],
    35: [(None, [("Barangay Certification", C), ("Community Tax Certificate", C)], None)],
    36: [(None, [("Barangay Certification", C), ("Community Tax Certificate", C)], None)],
    38: [
        ("Principal", [("Government-issued Valid Identification Card", C), ("Community Tax Certificate", "Office of the Sangguniang Barangay/Municipal Treasurer's Office"), ("Letter Request", C), ("Title/Deed of Conveyance", C)], None),
        ("Representative", [("Special Power of Attorney/Authorization Letter", "Client/Law Offices"), ("Government-issued Identification Card of the person being represented (photocopy)", "Client (principal)"), ("Government-issued Identification Card of the representative", "Client (representative)")], None),
    ],
    40: [
        ("Principal", [("Government-issued valid identification card", "Client/Government Offices"), ("Community tax certificate", "Client/Office of the Sangguniang Barangay or Municipal Treasurer's Office")], None),
        ("Representative", [("Special Power of Attorney/Authorization letter", "Client (principal)/Law Offices"), ("Government-issued valid identification card of the person being represented (photocopy)", "Client (representative)"), ("Government-issued valid identification card of the representative", "Client (principal)")], None),
        ("Transfer of ownership", [
            ("Electronic copy of title/Photocopy of title (Transfer Certificate of Title, Emancipation Patent, CLOA, etc.) if titled", "Register of Deeds (ROD)"),
            ("Transfer tax fee receipt (if applicable)", "Provincial Treasurer's Office"),
            ("Deed of conveyance (original/certified true copy)", "Law Offices"),
            ("Certificate Authorizing Registration (original/certified true copy)", "Bureau of Internal Revenue (BIR)"),
            ("Receipts of taxes paid (capital gains tax, donor's tax, estate tax and documentary stamp tax)", "Bureau of Internal Revenue (BIR)"),
            ("Approved subdivision plan (blueprint)", "Department of Environment and Natural Resources (DENR)"),
            ("Tax Clearance (original)", MTO)], None),
        ("Segregation/consolidation", [
            ("Approved subdivision/consolidation plan", C), ("Electronic copy of title", "Client/Register of Deeds (ROD)"),
            ("Department of Agrarian Reform Certification (beneficiaries)", "Department of Agrarian Reform (DAR)"),
            ("Tax Clearance", MTO), ("Tax Bill (if applicable)", MTO)], None),
        ("New assessment", [
            ("Electronic copy of title (if titled)", "Register of Deeds (ROD)"),
            ("Copy of free patent, miscellaneous sales or homestead application (if untitled)", "Community Environment and Natural Resources Office"),
            ("Community Environment and Natural Resources Office certification that the land is within alienable and disposable area (if untitled)", "Community Environment and Natural Resources Office"),
            ("Approved survey plan or BL form", "Department of Environment and Natural Resources Office"),
            ("Barangay Certification that the declarant is the actual possessor/occupant", OSB),
            ("Building plan with cost estimates/Certificate of Completion/Certificate of Occupancy", "Municipal Engineering and Building Office"),
            ("Acquisition cost, installation cost and other incidental expenses of machinery", "Municipal Engineering and Building Office")], None),
    ],
    42: [
        ("Principal", [("Government-issued valid identification card", C), ("Barangay Certification", OSB), ("Letter Request", C)], None),
        ("Representative", [("Special Power of Attorney/Authorization letter", "Law Office/Client"), ("Government-issued valid identification card of the person being represented", "Client (principal)"), ("Government-issued valid identification card of the representative", "Client (representative)")], None),
    ],
    46: [
        ("For correction of clerical errors", [
            ("Duly signed and subscribed petition", C),
            ("At least 2 documentary evidences showing the correct entry on which the correction shall be based", C, [
                "Baptismal Certificate", "Voter's Certification", "Employment Record", "GSIS/SSS/Pag-IBIG/PhilHealth Records",
                "School Records", "Medical Records", "Civil Registry Records of ascendants and descendants",
                "Civil Registry Documents of the document owner"]),
            ("Government-issued proof of identification", C)], None),
        ("For change of first name and correction of clerical error under RA 10172", [
            ("Baptismal Certificate", C), ("Earliest School Record", C),
            ("Employer certification or Affidavit of Non-Employment", C),
            ("Medical Record or Affidavit of No Medical Record, if correction of sex", C),
            ("Publication in a newspaper of general circulation", C), ("Affidavit of Publisher", C),
            ("Copy of newspaper clippings (at least once a week for 2 consecutive weeks)", C),
            ("Barangay Clearance", C), ("Police Clearance", C), ("NBI Clearance", C)],
            "The same requirements as for correction of clerical errors, plus:"),
    ],
    51: [(None, [
        ("Four (4) original copies of the Certificate of Marriage form, duly signed", C),
        ("Government-issued proof of identification", C),
        ("Authorization letter, if the informant is other than the couple or solemnizing officer", C)], None)],
    53: [
        ("For legitimation", [
            ("Four (4) original copies of the Joint Affidavit of Legitimation executed by both parents", C),
            ("CENOMAR of parents", C), ("Certificate of Marriage of parents", C),
            ("Certificate of Live Birth of the child in SECPA", C), ("Government-issued proof of identification", C)],
            "The joint affidavit may be executed by the surviving parent alone, provided the Certificate of Death of the deceased spouse is attached as proof."),
        ("For admission of paternity", [
            ("Four (4) original copies of the Affidavit of Admission of Paternity/Affidavit of Acknowledgment", C),
            ("Government-issued proof of identification", C)], None),
        ("For the Affidavit to Use the Surname of the Father (AUSF)", [
            ("Four (4) original copies of the Affidavit to Use the Surname of the Father", C),
            ("Government-issued proof of identification", C)], None),
    ],
    57: [
        (None, [
            ("Four (4) original copies of the Certificate of Live Birth form, duly signed by the birth attendant", C),
            ("Government-issued proof of identification", C), ("Information Sheet", C),
            ("Authorization letter, if the registrant is other than the parents of the document owner", C)], None),
        ("Additional requirements for delayed registration", [
            ("Personal appearance of the document owner if 18 years old and above. For document owners below 18, personal appearance of either parent is required for marital children; for non-marital children, personal appearance of both parents is mandatory", C),
            ("PSA Negative Certification of Birth issued within 1 year", C),
            ("Any 2 of the following documentary evidences", C, [
                "Baptismal Certificate", "Voter's Record", "School Records",
                "Membership data records (PhilHealth, HDMF, SSS, GSIS, OSCA and similar institutions)",
                "Other similar documents showing the name, birthday, birthplace and the names of the parents of the child"]),
            ("Certificate of Marriage of the document owner, if married", C),
            ("Certificate of Death of the document owner, if the person to be registered is already deceased", C),
            ("Affidavit for Delayed Registration of Birth", C), ("Affidavit of Two Disinterested Persons", C),
            ("Certificate of Residency from Barangay", C), ("Certificate of Indigency from Barangay, if indigent", C),
            ("Philippine Identification Card", C), ("2x2 picture with white background", C)],
            "As stipulated in Administrative Order No. 1, Series of 1993 and Memorandum Circular 2021-17."),
        ("For non-marital children", [
            ("Affidavit of Admission of Paternity (AAP), executed by the child's father", C),
            ("Affidavit to Use the Surname of the Father (AUSF), executed by the child's mother", C)], None),
    ],
    61: [
        (None, [
            ("Four (4) original copies of the Certificate of Death form, duly signed by the death attendant", C),
            ("Government-issued proof of identification", C), ("Information Sheet", C),
            ("Authorization letter, if the informant is other than the nearest of kin (PSA Memorandum Circular No. 2017-09)", C)], None),
        ("Additional requirements for delayed registration", [
            ("PSA Negative Certification of Death issued within 1 year", C),
            ("Barangay Certification for Delayed Registration", C), ("Picture of tombstone", C),
            ("Affidavit for Delayed Registration of Death", C)], None),
    ],
    64: [(None, [("Government-issued proof of identification", C), ("Duly filled-out prescribed form", C), ("Authorization letter, if the requester is other than the document owner", C)], None)],
    66: [(None, [("Government-issued proof of identification", C), ("Information Sheet", C), ("Authorization letter, if the requester is other than the document owner", C)], None)],
    68: [(None, [("Court Order", C), ("Certificate of Finality", C), ("Certificate of Authenticity", C), ("Government-issued proof of identification", C), ("Authorization letter, if the requester is other than the document owner/clerk of court", C)], None)],
    74: [(None, [
        ("Official copy of the police report and/or certified true copy of the barangay blotter report, as documentation and proof of legal purpose in acquiring the CCTV footage", "PNP"),
        ("CCTV Request Form – 1 original copy", "MDRRMO"),
        ("USB drive of at least 8 GB to save a copy of the footage upon approval", C)], None)],
    77: [(None, [("Ambulance Request Form – 1 original copy", "MDRRMO")], None)],
    106: [(None, [
        ("Electrical Permit Form, signed by the owner/applicant and the hired professionals – 4 original copies", MEBO_FORMS),
        ("SOCOTECO 1 application form, signed by the owner/applicant and the hired professional – 4 original copies", "SOCOTECO 1 (forms); owner/applicant (accomplished forms)"),
        ("Owner's valid ID with three specimen signatures – 1 certified copy (clear and legible photocopy)", OWNER),
        ("Barangay certification stating that the applicant is a bona fide resident of the area, signed by the owner/applicant – 4 sets", OWNER),
        ("Sketch plan, vicinity map or location map of the building – 4 original copies", OWNER),
        ("Building photos (front, rear, left side, right side, and circuit breaker or fuse) – 4 original copies", OWNER)], None)],
    132: [(None, [("Large Cattle Certificate of Ownership", C)], "No requirements for hogs.")],
    134: [(None, [("Community Tax Certificate", C), ("Market Clearance", C)], None)],
    136: [
        ("For a special quarry permit", [
            ("Barangay Resolution Interposing No Objection (RINO)", OSB),
            ("Photocopy of land title, deed of sale, FAAS or any proof of ownership (for private land)", C),
            ("Tax Clearance (for private land)", "Municipal Treasurer"),
            ("Community Tax Certificate/Senior Citizen ID", "Office of the Sangguniang Barangay/Municipal Treasurer's Office/Client"),
            ("Verification Report from PEMO", "Provincial Environment Management Office (PEMO)"),
            ("Certification from Upper Valley Quarry Operators Association", "Upper Valley Quarry Operators Association"),
            ("Special Power of Attorney (for representatives)", C),
            ("Rehabilitation Plan", None)], None),
        ("Additional requirements for a commercial quarry", [
            ("Business Permit", "Business Permits & Licensing Office"),
            ("Environmental Compliance Certificate (ECC)", "Department of Environment and Natural Resources – Environmental Management Bureau"),
            ("Rehabilitation Plan", C)], None),
    ],
    140: [(None, [("Community Tax Certificate/Senior Citizen ID", OSB), ("Letter request (for firms/agencies)", C)], None)],
    144: [(None, [
        ("Barangay Certification Interposing No Objection", OSB),
        ("Photocopy of land title/FAAS/deed of sale or any proof of ownership", C),
        ("Tax Clearance", MTO), ("Community Tax Certificate/Senior Citizen ID", C), ("Land Title", C),
        ("Certificate of Tree Plantation Registration (CTPR)/Tree Cutting Permit", "Community Environment and Natural Resources Office")], None)],
    150: [(None, [("5 copies of the Department and Treasury Clearance signed by the supervisor", C)], None)],
    155: [
        ("For food establishments", [
            ("Health Card for every food handler", "MHO Environment Sanitation Section"),
            ("Quarterly Standards-Based Rating Result", C), ("Working Permit Fee Official Receipt", MTO),
            ("BPLO Application", "Business Permit and Licensing Office"), ("Pest Control Contract", "Municipal Health Office")], None),
        ("For drinking water establishments (water refilling stations, barangay water systems)", [
            ("Health Card for every water vendor", "MHO Environment Sanitation Section"),
            ("Monthly Bacteriological Examination Result and Annual Physico-Chemical Result", "DOH-accredited water laboratory"),
            ("Quarterly Standards-Based Rating Result", C), ("Working Permit Fee Official Receipt", MTO),
            ("BPLO Application", "Business Permit and Licensing Office")], None),
        ("For non-food establishments", [
            ("Health Card", "MHO Environment Sanitation Section"), ("Pest Control Contract", "Municipal Health Office"),
            ("Working Permit Fee Official Receipt", MTO), ("BPLO Application", "Business Permit and Licensing Office")], None),
    ],
    157: [
        ("Laboratory results", [("Urinalysis", "MHO Laboratory"), ("Fecalysis", "MHO Laboratory"), ("Blood type", "MHO Laboratory"), ("Sputum", "MHO Laboratory"), ("X-ray results", "DOH-accredited medical laboratories")], None),
        (None, [("Food Handlers Certificate", "Municipal Health Office")], None),
    ],
    167: [(None, [("Referral", "Barangay Health Station"), ("Laboratory Result", C), ("GeneXpert result", "Accredited laboratory"), ("DSSM result", "Client, with the assistance of a Barangay Health Worker")], None)],
    181: [(None, [
        ("Birth Certificate (one photocopy, one original for verification)", "Municipal Civil Registrar's Office"),
        ("Updated Voter's Registration Record (one photocopy, one original for verification)", "COMELEC"),
        ("Two (2) pieces of 1x1 ID picture", C)], None)],
    182: [(None, [
        ("Barangay Certification (one original copy)", OSB),
        ("Medical Certificate (one original copy)", "Municipal Health Office/Private Physician"),
        ("Any government-issued valid ID (one photocopy and original for verification)", C),
        ("1x1 ID picture (2 pieces)", C), ("2x2 ID picture (1 piece)", C)], None)],
    190: [(None, [
        ("Form and Sworn Affidavit (unwed, abandonment, separated in fact, widow or widower 2 years and above), if applicable", "MSWDO/Public Attorney's Office"),
        ("Affidavit of Legal Guardianship", "Public Attorney's Office"),
        ("1x1 photo ID and 1 pc 2x2 ID", C),
        ("Barangay Certificate of Residency", OSB),
        ("Order of Finality (legally separated, annulment)", "Regional Trial Court"),
        ("Death Certificate (widow/widower)", "Office of the Municipal Civil Registrar"),
        ("Medical Certificate (if the spouse has physical/mental incapacity)", "Municipal Health Officer/Private Physician"),
        ("Birth Certificate of minor children", "Philippine Statistics Authority/Office of the Municipal Civil Registrar"),
        ("CENOMAR (for unmarried)", "Office of the Municipal Civil Registrar"),
        ("Marriage Certificate (for married)", "Office of the Municipal Civil Registrar"),
        ("Income Tax Return (ITR) or any proof of income", "Bureau of Internal Revenue (BIR)"),
        ("Barangay Certificate that indicates how long you've been a solo parent", OSB),
        ("Community Tax Certificate/Cedula", "Office of the Sangguniang Barangay/Municipal Treasurer's Office"),
        ("Voter's Certification", "Commission on Elections (COMELEC)")],
        "Which of these you need depends on your solo-parent category. The charter lists the requirements per category on pages 192–200.")],
    202: [(None, [
        ("Accomplished Information Slip", MTO),
        ("For individuals: government-issued valid identification card", "Government agencies and private institutions"),
        ("For corporations/cooperatives: Securities and Exchange Commission/Cooperative Development Authority registration", "Securities and Exchange Commission/Cooperative Development Authority")], None)],
    207: [(None, [("Tax Bill/Tax Due Worksheet/Charge Slip", "Municipal Treasurer's Office or other municipal offices")], None)],
    209: [(None, [
        ("Accomplished Request Slip", "Public Employment Service Office"), ("Resume", C),
        ("Other requirements if the company requires them (Barangay Clearance, NBI, Police Clearance, Birth Certificate, TOR/Diploma)", C)], None)],
    213: [(None, [("Approach the Public Assistance Information Desk Officer for inquiry", "Public Employment Service Office"), ("Valid ID", C)], None)],
    214: [(None, [
        ("Any valid government-issued ID", "Applicant"), ("Cedula/CTC", "Office of the Sangguniang Barangay/MTO"),
        ("Filled-out Beneficiary Profile Form", "Public Employment Service Office"),
        ("Filled-out TUPAD Form", "Public Employment Service Office")], None)],
    225: [
        ("For private individuals", [("Request Letter", C), ("Filled-up Request Slip", C)], None),
        ("For government offices/agencies", [("Request Letter", C)], None),
    ],
    227: [(None, [("Written request, if possible", C)], None)],
    230: [(None, [
        ("Letter request approved by the Mayor (2 copies, original)", C),
        ("Government-issued ID, original (returned when the borrowed property is returned)", C)], None)],
}

# page -> total time as printed in the charter, where the TOTAL row sits outside the parsed table
TOTAL = {
    40: ("6 days and 30 minutes", "None"),
    72: ("45 minutes", None),
    140: ("1 hour and 30 minutes", None),
    154: ("4 days and 5 minutes", None),
    176: ("1 day, 2 hours and 5 minutes", None),
    188: ("2 days and 35 minutes", "None"),
    46: ("10 days, 4 hours and 20 minutes", None),
    68: ("10 days, 1 hour and 30 minutes", "₱1,000.00"),
}

# page -> who may avail, where the charter's text is a long legal excerpt
WHO = {
    190: "Solo parents under any of the categories in Section 12 of the Solo Parents' Welfare Act (listed on pages 190–191 of the charter)",
}

# page -> keep only the first N parsed steps (later rows are fee schedules)
KEEP_STEPS = {140: 3, 144: 4}

STEP_FIX = {
    140: {2: {"client": "Present the official receipt and receive the final schedule of the request",
              "agency": ["3.1 Acknowledge and record the official receipt", "3.2 Conduct site inspection and schedule garbage collection", "3.3 Inform the client of the scheduled collection"],
              "fees": "None", "time": "5 minutes + 1 hour + 10 minutes", "person": "Clerk II MENRO, Forest Ranger MENRO, EMS I MENRO, Labor Foreman MENRO"}},
}

# page -> extra notes shown on the service page
NOTES = {
    15: ["Fees depend on the activity (conferences and rallies, dances, stage presentations, contests, and more) under Ord. No. 5, s. 2025. The full list is on pages 15–17 of the charter."],
    18: ["Franchises are renewable every 3 years, and only bona fide residents may apply."],
    140: ["Garbage fees depend on the type of establishment, from residential houses to hospitals. The full schedule is on pages 140–141 of the charter."],
    144: ["Transport fees depend on the forest product (logs and lumber, bamboo, rattan, firewood, charcoal, plants, animals). The full schedule is on pages 145–146 of the charter."],
    42: ["The inspection fee depends on your barangay. The full list is on pages 42–44 of the charter."],
    190: ["Requirements per solo-parent category (for example widow/widower, spouse of an OFW, unmarried person, legal guardian) are listed on pages 192–200 of the charter."],
}

# page -> (plain-language name, search aliases)
NAMES = {
    11: ("Business permit (new & renewal)", ["business permit", "mayor's permit", "BOSS", "business registration", "renew business", "negosyo"]),
    15: ("Special & municipal permit for events", ["event permit", "parade", "motorcade", "streamer", "rally", "fiesta", "cockfight", "concert", "permit to hold"]),
    18: ("Tricycle franchise (MTOP), new & renewal", ["tricycle", "MTOP", "franchise", "TODA", "prangkisa", "trisikad"]),
    21: ("Tricycle MTOP sticker", ["tricycle sticker", "MTOP sticker", "TODA"]),
    23: ("Business closure", ["close business", "retire business", "business retirement", "stop operation"]),
    25: ("Business permit online (eBPLS) or walk-in", ["online business permit", "eBPLS", "iBPLS", "eGovPH", "GCash", "business permit"]),
    28: ("Film & media shooting permit", ["film", "video shoot", "shooting", "media", "documentary", "commercial ad"]),
    31: ("Animal treatment, deworming & vitamins", ["veterinary", "livestock", "cattle", "carabao", "deworming", "vitamins", "hayop"]),
    32: ("Artificial insemination & castration", ["artificial insemination", "breeding", "castration", "livestock", "cattle"]),
    33: ("Seeds & seedlings distribution", ["rice seeds", "corn seeds", "vegetable seeds", "seedlings", "fruit trees", "RSBSA", "binhi"]),
    34: ("Farmer certification", ["farmer certificate", "magsasaka"]),
    35: ("Farm tractor services", ["tractor", "plowing", "land preparation"]),
    36: ("Biological pest control (Metarhizium)", ["pest control", "Metarhizium", "biocontrol", "insects"]),
    38: ("Tax declaration – certified copy", ["tax dec", "tax declaration", "certified copy", "land", "property"]),
    40: ("Tax declaration – owner's copy, transfer & new assessment", ["tax dec", "tax declaration", "transfer of ownership", "new assessment", "segregation", "consolidation", "land title"]),
    42: ("Property & landholding certification", ["landholding", "no property", "improvement", "assessor certification", "property certification"]),
    46: ("Correction of clerical errors & change of first name", ["RA 9048", "RA 10172", "wrong spelling", "birth certificate correction", "change name", "correction of sex", "petition", "typo"]),
    51: ("Marriage registration", ["marriage certificate", "kasal", "register marriage", "wedding"]),
    53: ("Registration of legal instruments", ["legitimation", "acknowledgment", "paternity", "AUSF", "surname of the father", "affidavit"]),
    57: ("Birth registration", ["birth certificate", "certificate of live birth", "late registration", "delayed registration", "newborn", "register birth"]),
    61: ("Death registration", ["death certificate", "burial permit", "transfer of cadaver", "delayed registration"]),
    64: ("PSA documents on security paper & CENOMAR", ["PSA", "SECPA", "CENOMAR", "security paper", "birth certificate copy", "marriage certificate copy", "NSO"]),
    66: ("Certified copies of civil registry documents", ["certified true copy", "local civil registry", "birth certificate copy", "marriage certificate copy", "death certificate copy", "form 1A"]),
    68: ("Registration of court decrees", ["annulment", "adoption", "court order", "nullity", "court decision"]),
    72: ("DRRM training or resource speaker", ["disaster training", "first aid", "seminar", "earthquake drill", "speaker"]),
    73: ("IEC materials & hazard maps", ["hazard map", "flood map", "posters", "IEC"]),
    74: ("CCTV footage request", ["CCTV", "video footage", "blotter", "police report"]),
    75: ("Relief distribution & disaster assistance", ["relief goods", "evacuation", "calamity", "flood", "fire victims", "ayuda"]),
    76: ("Emergency response", ["rescue", "emergency", "accident", "responder"]),
    77: ("Ambulance for patient or cadaver transport", ["ambulance", "patient transport", "cadaver", "hospital transfer"]),
    79: ("Building permit", ["construction permit", "house construction", "renovation", "repair", "demolition", "fence", "signage", "NBC", "building code"]),
    94: ("Certificate of occupancy", ["occupancy permit", "certificate of occupancy", "CO", "as-built"]),
    106: ("Electrical permit for SOCOTECO 1 connection", ["electric connection", "SOCOTECO", "kuryente", "electricity", "meter", "indigenous dwelling"]),
    127: ("Market clearance", ["public market", "market stall", "vendor"]),
    128: ("Terminal certification", ["public terminal", "bus terminal", "transport organization"]),
    129: ("Cemetery certificate of perpetual use", ["cemetery", "burial", "interment", "tomb", "sementeryo"]),
    130: ("Cemetery leasehold contract", ["cemetery", "burial lot", "lease", "sementeryo"]),
    131: ("Rented ground (RTC) certification", ["RTC", "rented ground", "festival stall", "occupy"]),
    132: ("Meat inspection certificate", ["slaughterhouse", "hog", "pig", "cattle", "meat", "karne"]),
    134: ("Market / RTC leasehold contract", ["market stall lease", "leasehold", "stall"]),
    136: ("Quarry (small-scale dredging) certification", ["quarry", "sand and gravel", "dredging", "commercial quarry"]),
    138: ("Chainsaw certification", ["chainsaw registration", "chainsaw"]),
    140: ("Garbage collection request", ["basura", "garbage", "waste collection", "trash"]),
    142: ("Tree cutting or pruning certification", ["tree cutting permit", "pruning", "cut tree", "puno"]),
    144: ("Transport certification for forest products", ["lumber", "logs", "charcoal", "bamboo", "rattan", "firewood", "transport permit"]),
    147: ("Solid waste management (SWM) compliance certification", ["SWM", "waste compliance", "ECC"]),
    150: ("Property clearance for LGU employees", ["clearance", "accountability", "employee"]),
    151: ("Borrow a sound system, chairs or tents", ["sound system", "tent", "chairs", "borrow", "equipment"]),
    152: ("Repair & maintenance request (LGU offices)", ["repair", "maintenance", "janitorial"]),
    154: ("Environmental sanitation complaint inspection", ["complaint", "nuisance", "foul odor", "sanitation", "pollution"]),
    155: ("Sanitary permit", ["sanitary permit", "food establishment", "water refilling", "business"]),
    157: ("Health card", ["health card", "health certificate", "food handler"]),
    158: ("Adolescent health services", ["teen health", "adolescent", "youth health", "reproductive health"]),
    160: ("Laboratory examination", ["lab test", "laboratory", "urinalysis", "fecalysis", "blood test"]),
    162: ("Medical consultation", ["check-up", "doctor", "consultation", "RHU", "health center"]),
    164: ("Tooth extraction", ["dental", "dentist", "tooth", "bunot"]),
    166: ("Normal delivery (birthing services)", ["birthing", "panganganak", "pregnant", "delivery", "maternity"]),
    167: ("Tuberculosis (TB) treatment", ["TB", "DOTS", "tuberculosis", "cough"]),
    168: ("Minor surgery & wound care", ["wound", "stitches", "minor surgery", "sugat"]),
    169: ("Animal bite treatment", ["dog bite", "rabies", "anti-rabies", "cat bite", "kagat"]),
    172: ("Payroll certification for loans (LGU employees)", ["loan", "payroll", "employee"]),
    173: ("Certificate of employment (LGU employees)", ["COE", "employment certificate", "employee"]),
    174: ("Service record (LGU employees)", ["service record", "employee"]),
    176: ("Locational clearance", ["zoning clearance", "locational clearance", "land use", "construction"]),
    178: ("Zoning certification", ["zoning", "land classification", "land use"]),
    181: ("Senior citizen ID & purchase booklet", ["senior citizen", "OSCA", "senior ID", "booklet", "discount", "60 years"]),
    182: ("PWD ID & purchase booklet", ["PWD", "disability", "person with disability", "PWD ID", "discount"]),
    183: ("Social case study report & referral letter", ["case study", "referral letter", "medical assistance", "burial assistance", "transportation assistance"]),
    185: ("Travel clearance for minors (local)", ["minor travel", "travel clearance", "child travel", "bata"]),
    186: ("Aid for Individuals in Crisis Situation (AICS)", ["AICS", "financial assistance", "medical assistance", "burial assistance", "ayuda", "emergency shelter"]),
    188: ("Balik-Probinsya assistance", ["stranded", "return home", "balik probinsya", "fare"]),
    189: ("Certificate of indigency", ["indigency", "indigent", "poor"]),
    190: ("Solo parent ID", ["solo parent", "single parent", "single mom", "single dad"]),
    202: ("Cedula (community tax certificate)", ["cedula", "CTC", "community tax"]),
    204: ("Tax clearance / certification", ["tax clearance", "tax certification"]),
    205: ("Real property tax bill", ["amilyar", "RPT", "land tax", "property tax", "real property tax"]),
    206: ("Business tax bill", ["business tax", "MBT", "tax bill"]),
    207: ("Official receipt for payments", ["OR", "payment", "official receipt"]),
    209: ("Job applicant endorsement letter", ["job", "employment", "endorsement", "trabaho", "work"]),
    211: ("OWWA assistance referral", ["OWWA", "OFW", "overseas"]),
    213: ("Site visit certification for returning OFWs", ["OFW", "Balik Pinas", "Balik Hanapbuhay", "livelihood"]),
    214: ("TUPAD emergency employment", ["TUPAD", "DOLE", "temporary employment", "displaced workers"]),
    216: ("Government Internship Program (GIP) referral", ["GIP", "internship", "OJT", "fresh graduate"]),
    218: ("Certificate of no objection for recruitment activities", ["recruitment", "job fair", "agency", "SRA", "LRA"]),
    219: ("Online appointment assistance (PSA, NBI, PNP, DFA)", ["online appointment", "PSA", "NBI", "police clearance", "DFA", "passport"]),
    220: ("DOLE livelihood program (DILP) referral", ["DILP", "livelihood", "kabuhayan", "DOLE"]),
    221: ("Mayor's permit to work / occupational card", ["work permit", "occupational card", "working permit", "first time job seeker"]),
    222: ("Community-based trainings", ["TESDA", "skills training", "livelihood training", "training"]),
    223: ("ESC voucher (Education Service Contracting)", ["ESC", "voucher", "private high school", "scholarship"]),
    225: ("Certified copies of SB minutes, resolutions & ordinances", ["ordinance", "resolution", "minutes", "SB", "Sangguniang Bayan", "committee report"]),
    227: ("Tourist assistance & information", ["tourist", "tourism", "tourist spots", "travel"]),
    228: ("Tour coordination", ["tour", "field trip", "educational tour"]),
    229: ("Research or interview request", ["research", "interview", "thesis", "media"]),
    230: ("Borrow a government facility or property", ["venue", "gym", "facility", "borrow", "covered court"]),
}

# Engineering office services written by hand: the charter prints simple, complex and highly technical
# variants back to back, and leaves their TOTAL rows blank.
BUILDING_PERMIT = {
    "office": "ome", "page": 79, "endPage": 93,
    "officialTitle": "Issuance of Building Permit",
    "summary": "Under PD 1096 (the National Building Code), the Office of the Municipal Engineer & Building Official (MEBO) issues building permits for the construction, alteration, repair, conversion, use, occupancy, moving, demolition of, and addition to public and private buildings and structures — except traditional indigenous family dwellings and projects under BP 220 (economic and socialized housing). A building permit is required before any building or structure is constructed, altered, repaired, converted, used, occupied, moved or demolished.",
    "classification": "Simple, complex or highly technical",
    "transaction": ["G2C", "G2B", "G2G"],
    "whoMayAvail": "Anyone",
    "requirements": [
        {"label": None, "note": None, "items": [
            {"item": "Notarized Unified Application Form for Building Permit (NBC Form No. B-01), signed and sealed by the hired professional (licensed civil engineer/architect) – 6 copies", "where": MEBO_FORMS},
            {"item": "Sanitary/Plumbing Permit Form, signed and sealed by a licensed sanitary engineer or master plumber – 6 copies", "where": MEBO_FORMS},
            {"item": "Electrical Permit Form, signed and sealed by a professional or registered electrical engineer – 6 copies", "where": MEBO_FORMS},
            {"item": "Mechanical Permit Form, signed and sealed by a professional or registered mechanical engineer – 6 copies", "where": MEBO_FORMS},
            {"item": "Electronics Permit Form, signed and sealed by a licensed electronics engineer – 6 copies", "where": MEBO_FORMS},
            {"item": "Building plans (architectural, civil, structural, plumbing/sanitary, electrical, mechanical, electronics), signed and sealed by the hired professionals and the owner – 6 sets", "where": OWNER},
            {"item": "Assessor's Certificate/Tax Declaration – 6 copies", "where": "Municipal Assessor's Office"},
            {"item": "Current Real Property Tax Receipt/Tax Clearance – 6 copies", "where": MTO},
            {"item": "Cost estimates/bill of materials, signed and sealed by an architect or civil engineer – 6 original copies", "where": OWNER},
            {"item": "Specifications, signed and sealed by an architect or civil engineer – 6 original copies", "where": OWNER},
            {"item": "Zoning/Locational Clearance – 6 copies", "where": "Municipal Planning and Development Office (MPDO)"},
            {"item": "Fire Safety Evaluation Clearance – 1 original (OBO copy)", "where": "Bureau of Fire Protection (BFP)"},
            {"item": "Proof of ownership/land ownership – 6 copies", "where": OWNER},
            {"item": "Owner's/applicant's valid ID with 3 specimen signatures – 3 copies", "where": OWNER},
            {"item": "PRC IDs, current PTR and TIN of all signing professionals – 3 copies per professional", "where": OWNER},
        ]},
        {"label": "Conditional requirements", "note": None, "items": [
            {"item": "If the applicant is not the registered owner of the lot, any of the following", "where": OWNER, "options": [
                "Notarized contract of lease or award notice", "Notarized deed of absolute sale/donation/usufruct",
                "Notarized contract of sale", "Notarized authority to construct/affidavit of heirs/authorization letter",
                "Corporate secretary's certificate authorizing the signatory", "Special power of attorney (SPA)",
                "Certified copy of tax declaration (1 original, 5 photocopies)",
                "Current/latest real property tax receipt or land tax clearance (1 original, 5 photocopies)"]},
            {"item": "Construction Safety & Health Program (CSHP) – for buildings 3 storeys and above, or 6.0 m or more above ground (1 original, 1 photocopy)", "where": "Department of Labor & Employment (DOLE)"},
            {"item": "Structural analysis & design – except one-storey single detached structures of 20.0 m² or less (3 copies)", "where": "Hired professional (licensed civil/structural engineer)"},
            {"item": "Seismic analysis (3 copies)", "where": "Hired professional (licensed civil/structural engineer)"},
            {"item": "Boring and load tests – for buildings three storeys and higher (3 copies)", "where": "Hired professional (licensed civil/geotechnical engineer)"},
            {"item": "CAAP (ATO) clearance – for towers and tall structures within 4.0 km of the nearest runway (3 copies)", "where": "Civil Aviation Authority of the Philippines (CAAP)"},
            {"item": "Environmental Compliance Certificate (ECC) – for environmentally critical projects or projects in environmentally critical areas (3 copies)", "where": "DENR – Environmental Management Bureau"},
            {"item": "DPWH clearance – for buildings along a national highway (3 copies)", "where": "DPWH District Engineering Office"},
            {"item": "Road right-of-way (RROW) clearance – for buildings along municipal, barangay or subdivision roads (3 copies)", "where": "Municipal Engineering Office (MEO)"},
            {"item": "Corporations, community associations, government housing projects and subdivision developers submit additional documents (authorizations, board resolutions, membership certificates, housing clearances, approved development permits). See pages 80–81 of the charter.", "where": None},
        ]},
    ],
    "steps": [
        {"label": "Apply", "client": "Submit the application forms and documentary requirements", "agency": ["Receive and assess the submitted plans and documents", "Conduct site inspection and verification", "Evaluate the plans"], "fees": "None", "time": "", "person": "Engineer I, Engineer II MEBO"},
        {"label": "Pay", "client": "Receive the order of payment, have the plans endorsed, and pay the corresponding fees", "agency": ["Calculate and prepare building fees based on the NBCDO schedule of fees and other charges", "Issue the order of payment"], "fees": "Based on the NBCDO schedule of fees and other charges", "time": "", "person": "Engineer I, Engineer II MEBO"},
        {"label": None, "client": "Proceed to the Municipal Treasurer's Office for payment", "agency": ["Receive payment and issue the official receipt"], "fees": "NBCDO schedule of fees and charges", "time": "10 minutes", "person": "RCC III MTO, RCC II MTO"},
        {"label": None, "client": "Present the documents from the Bureau of Fire Protection", "agency": ["Receive the documents from the Bureau of Fire Protection"], "fees": "None", "time": "10–20 minutes", "person": "Engineer I MEBO, Admin Aide VI/Clerk III MEBO"},
        {"label": "Claim", "client": "Claim the approved Building Permit and ancillary permits", "agency": ["Receive the order of payment and official receipts", "Process and prepare the Building Permit", "Release the approved permit, plans and other documents"], "fees": "None", "time": "", "person": "MEBO"},
    ],
    "totalTime": "", "totalFee": None,
    "notes": [
        "Simple applications cover private garages up to 90 m², carports, sheds, agricultural buildings, fences over 1.80 m, tanks and towers; repairs that don't change approved plans; demolition of a single residential structure up to 300 m² and three storeys; signage; and stand-alone mechanical, sanitary, electrical, electronics and accelerograph permits (page 79).",
        "Complex and highly technical applications follow the same steps with longer review times (pages 84–93). The charter does not print a total processing time for these applications.",
        "Fees are computed from the National Building Code schedule of fees and other charges on pages 108–125 of the charter.",
    ],
}

OCCUPANCY = {
    "office": "ome", "page": 94, "endPage": 105,
    "officialTitle": "Issuance of Certificate of Occupancy",
    "summary": "Under PD 1096 (the National Building Code), Section 309, the Office of the Municipal Engineer & Building Official (MEBO) issues a Certificate of Occupancy once construction is complete and before the building is occupied. MEBO checks that the completed building follows the standards and the plans attached to the approved Building Permit; any revisions made during construction must be reflected in the as-built plans.",
    "classification": "Simple, complex or highly technical",
    "transaction": ["G2C", "G2B", "G2G"],
    "whoMayAvail": "Anyone",
    "requirements": [
        {"label": None, "note": None, "items": [
            {"item": "Unified Application Form for Certificate of Occupancy, signed by the owner/applicant – 6 original copies", "where": MEBO_FORMS},
            {"item": "Notarized Certificate of Completion form (NBC Form No. B-10), signed and sealed by the hired professional (licensed civil engineer/architect) – 6 original copies", "where": MEBO_FORMS},
            {"item": "Approved Building Permit – 1 certified copy (clear and legible photocopy)", "where": OWNER},
            {"item": "As-built plans, signed and sealed by the hired licensed or registered professionals – 4 sets", "where": OWNER},
            {"item": "Cost estimates/bill of materials, signed and sealed by a licensed civil engineer or architect – 4 original copies", "where": OWNER},
            {"item": "Building specifications, signed and sealed by a licensed civil engineer or architect – 4 original copies", "where": OWNER},
            {"item": "Construction logbook – 1 original copy", "where": OWNER},
        ]},
        {"label": "Conditional requirements", "note": None, "items": [
            {"item": "Construction logbook sheet (NBC Form No. B-15), signed by a licensed civil engineer or architect, if the owner/applicant has no construction logbook – 1 original copy", "where": MEBO_FORMS},
            {"item": "Authorization letter, if the applicant is not the owner – 1 original copy", "where": OWNER},
        ]},
    ],
    "steps": [
        {"label": "Apply", "client": "Submit the application forms and documentary requirements", "agency": ["Receive and assess the submitted documents", "Conduct site inspection and verification", "Evaluate the documents"], "fees": "None", "time": "", "person": "Engineer I, Engineer II MEBO"},
        {"label": "Pay", "client": "Receive the order of payment and pay the corresponding fees", "agency": ["Calculate and prepare fees based on the NBCDO schedule of fees and other charges", "Issue the payment slip", "Endorse the documents to the Bureau of Fire Protection"], "fees": "Based on the NBCDO schedule of fees and other charges", "time": "", "person": "Engineer I MEBO, Admin Aide VI/Clerk III MEBO"},
        {"label": None, "client": "Proceed to the Municipal Treasurer's Office for payment", "agency": ["Receive payment and issue the official receipt"], "fees": "NBCDO schedule of fees and charges", "time": "10–15 minutes", "person": "RCC III MTO, RCC II MTO"},
        {"label": None, "client": "Present the documents from the Bureau of Fire Protection", "agency": ["Receive the documents from the Bureau of Fire Protection"], "fees": "None", "time": "10–20 minutes", "person": "Engineer I MEBO, Admin Aide VI/Clerk III MEBO"},
        {"label": "Claim", "client": "Claim the Certificate of Occupancy", "agency": ["Receive the official receipts and order of payment", "Process and prepare the Certificate of Occupancy", "Release the Certificate of Occupancy"], "fees": "None", "time": "", "person": "MEBO"},
    ],
    "totalTime": "", "totalFee": None,
    "notes": [
        "Simple, complex and highly technical applications follow the same steps with different review times (pages 94–105). The charter does not print a total processing time for these applications.",
        "Fees are computed from the National Building Code schedule of fees and other charges on pages 108–125 of the charter.",
    ],
}

# Rows where the PDF packs the next client step into the same cell.
STEP_FIX.update({
    25: {2: {"client": "Walk-in: receive the business permit. Online: a copy of your business permit will be uploaded to your iBPLS account"}},
    64: {1: {"client": "Proceed to the Treasurer's Office for payment. Make sure to secure the official receipt that will be issued upon payment",
             "agency": ["Accept payment based on the order of payment and issue the official receipt"],
             "fees": "Service charge (BREQS) Php200.00", "time": "10 minutes", "person": "RCC III MTO, RCC II MTO"}},
    202: {0: {"client": "Fill up the Community Tax Certificate information slip and present a valid ID/business permit or application",
              "agency": ["Receive, acknowledge and evaluate the information slip and valid ID/business permit or application"],
              "fees": "None", "time": "5 minutes", "person": "RCC III MTO"},
          1: {"person": "RCC III MTO, RCC II MTO"},
          2: {"person": "RCC III MTO"}},
    205: {0: {"client": "Present the tax declaration or ARP number",
              "agency": ["Receive and verify the tax declaration and ARP number presented", "Prepare the RPTAR and compute the tax bill"],
              "fees": "None", "time": "1 hour + 20 minutes", "person": "LTOO I MTO, LTOA MTO"},
          1: {"person": "LTOA MTO"}},
    206: {0: {"client": "Present the approved business permit application form",
              "agency": ["Receive and verify the approved business permit application form", "Record/control the application form received", "Compute the tax due"],
              "fees": "None", "time": "10 minutes + 5 minutes + 1 hour", "person": "LTOO I MTO, LTOA MTO"},
          1: {"person": "LTOA MTO"}},
    207: {0: {"client": "Present the tax bill, tax due worksheet or charge slip",
              "agency": ["Receive and verify the tax bill, tax due worksheet or charge slip"],
              "fees": "None", "time": "5 minutes", "person": "RCC III MTO"},
          1: {"person": "RCC II MTO, RCC III MTO"}},
})

# page -> steps to append (after the parsed ones)
STEP_ADD = {
    64: [{"label": None, "client": "Return to the Office of the Municipal Civil Registrar to submit the official receipt and claim the request",
          "agency": ["Check the official receipt", "Instruct the client to claim the document after 8 days",
                     "Issue the requested civil registry document and/or CENOMAR in SECPA copy to the client"],
          "fees": "None", "time": "5 minutes + 8 days + 5 minutes", "person": "Assistant Registration Officer MCRO"}],
}
