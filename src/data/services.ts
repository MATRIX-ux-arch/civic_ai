export interface ServiceDocument {
  id: string;
  name: string;
  description: string;
}

export interface CivicService {
  id: string;
  serviceName: string;
  category: string;
  description: string;
  documents: ServiceDocument[];
  pdfTemplate: string;
  icon: string;
}

export const services: CivicService[] = [
  {
    id: "income-certificate",
    serviceName: "Income Certificate",
    category: "Revenue",
    description: "Certificate issued by the government to verify annual income of an individual or family.",
    icon: "💰",
    pdfTemplate: "income_certificate",
    documents: [
      { id: "ic-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "ic-2", name: "Ration Card", description: "Family ration card copy" },
      { id: "ic-3", name: "Salary Slip / Income Proof", description: "Last 3 months salary slip or self-declaration" },
      { id: "ic-4", name: "Passport Size Photo", description: "Recent passport size photograph" },
      { id: "ic-5", name: "Address Proof", description: "Utility bill or bank statement" },
    ],
  },
  {
    id: "caste-certificate",
    serviceName: "Caste Certificate",
    category: "Revenue",
    description: "Official document certifying caste/community of an individual for reservation benefits.",
    icon: "📜",
    pdfTemplate: "caste_certificate",
    documents: [
      { id: "cc-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "cc-2", name: "Parent's Caste Certificate", description: "Father's or mother's caste certificate" },
      { id: "cc-3", name: "School Leaving Certificate", description: "With caste mentioned" },
      { id: "cc-4", name: "Ration Card", description: "Family ration card copy" },
      { id: "cc-5", name: "Passport Size Photo", description: "Recent passport size photograph" },
    ],
  },
  {
    id: "residence-certificate",
    serviceName: "Residence Certificate",
    category: "Revenue",
    description: "Certificate proving residential address for government and institutional purposes.",
    icon: "🏠",
    pdfTemplate: "residence_certificate",
    documents: [
      { id: "rc-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "rc-2", name: "Ration Card", description: "Family ration card copy" },
      { id: "rc-3", name: "Electricity Bill", description: "Recent electricity or water bill" },
      { id: "rc-4", name: "Passport Size Photo", description: "Recent passport size photograph" },
    ],
  },
  {
    id: "birth-certificate-correction",
    serviceName: "Birth Certificate Correction",
    category: "Municipal",
    description: "Application for correction of errors in an existing birth certificate.",
    icon: "👶",
    pdfTemplate: "birth_correction",
    documents: [
      { id: "bc-1", name: "Original Birth Certificate", description: "Existing birth certificate with error" },
      { id: "bc-2", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "bc-3", name: "Affidavit", description: "Notarized affidavit stating the correction needed" },
      { id: "bc-4", name: "Supporting Document", description: "School record or passport showing correct details" },
      { id: "bc-5", name: "Passport Size Photo", description: "Recent passport size photograph" },
    ],
  },
  {
    id: "scholarship-application",
    serviceName: "Scholarship Application",
    category: "Education",
    description: "Application form for government education scholarship programs.",
    icon: "🎓",
    pdfTemplate: "scholarship",
    documents: [
      { id: "sa-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "sa-2", name: "Income Certificate", description: "Family income certificate" },
      { id: "sa-3", name: "Marksheet", description: "Previous year examination marksheet" },
      { id: "sa-4", name: "Bank Passbook", description: "First page with account details" },
      { id: "sa-5", name: "Caste Certificate", description: "If applicable for reservation category" },
      { id: "sa-6", name: "Passport Size Photo", description: "Recent passport size photograph" },
    ],
  },
  {
    id: "water-complaint",
    serviceName: "Water Supply Complaint",
    category: "Municipal",
    description: "Form to report water supply issues in your area to municipal authorities.",
    icon: "💧",
    pdfTemplate: "water_complaint",
    documents: [
      { id: "wc-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "wc-2", name: "Address Proof", description: "Proof of residence in affected area" },
      { id: "wc-3", name: "Water Bill", description: "Recent water supply bill if available" },
    ],
  },
  {
    id: "garbage-complaint",
    serviceName: "Garbage / Sanitation Complaint",
    category: "Municipal",
    description: "Form to report garbage collection or sanitation issues to municipal corporation.",
    icon: "🗑️",
    pdfTemplate: "garbage_complaint",
    documents: [
      { id: "gc-1", name: "Aadhaar Card", description: "Government-issued identity proof" },
      { id: "gc-2", name: "Address Proof", description: "Proof of residence in affected area" },
      { id: "gc-3", name: "Photo Evidence", description: "Photos of the issue (optional but recommended)" },
    ],
  },
];

export function matchService(message: string): CivicService | null {
  const lower = message.toLowerCase();
  const mappings: [string[], string][] = [
    [["income"], "income-certificate"],
    [["caste"], "caste-certificate"],
    [["residence", "domicile", "address proof"], "residence-certificate"],
    [["birth", "born"], "birth-certificate-correction"],
    [["scholarship", "education grant"], "scholarship-application"],
    [["water", "tap", "pipeline"], "water-complaint"],
    [["garbage", "sanitation", "trash", "waste", "dump"], "garbage-complaint"],
  ];

  for (const [keywords, serviceId] of mappings) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return services.find((s) => s.id === serviceId) || null;
    }
  }
  return null;
}
